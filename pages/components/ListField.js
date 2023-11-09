import React, { useEffect, useState } from 'react';
import ListFieldItem from './ListFieldItem';
import {
	Box,
	Button,
	Modal,
	ModalHeader,
	ModalCloseButton,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalFooter,
	Spinner,
	Flex
} from '@chakra-ui/react'
import FormFields from './FormFields';
import { useManagePageForm } from '../contexts/useManagePageForm';


const ListField = ({ obj, index, nestedKey }) => {
	const [items, setItems] = useState(null);
	const [open, setOpen] = useState(false);
	const [loading, setLoading] = useState(false);
	const [fieldArr, setFieldArr] = useState(null);
	const [data, setData] = useState({});
	const { formSelected, setFormSelected, pageFormData, setPageFormData } = useManagePageForm();

	useEffect(() => {
		handleGetList();
		async function handleGetList() {
			const res = await fetch('/api/get_list_field_items',
			{
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					schema: obj.caster.options.ref,
					selectedIds: nestedKey.split('.').length > 1 ?
						pageFormData[nestedKey][index]?.map(obj => obj._id) :
							pageFormData[nestedKey]?.map(obj => obj._id)
				})
			})
			const data = await res.json();
			const { items } = data;
			setItems(items);
		}
	}, [])

	useEffect(() => {
		handleModelSchema();
		async function handleModelSchema() {
			const res = await fetch('/api/get_model_schema',
			{
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					schema: 'Templates'
				})
			})
			const data = await res.json();
			const { schemaPaths } = data;
			setFieldArr(Object.entries(schemaPaths));
		}
	}, [])

	return (
		<Flex
			flexDir='column'
		>
			<Box
				outline='black solid .1rem'
				borderRadius='.2rem'
				height='300px'
				overflow='auto'
				my='1rem'
				padding='.5rem'
			>
				{
					nestedKey.split('.').length === 1 &&
						pageFormData[nestedKey]?.map(item => {
							return <ListFieldItem item={item} />
						})
				}
				{
					nestedKey.split('.').length === 1 &&
						!pageFormData[nestedKey]?.length &&
							'No items chosen'
				}
				{
					nestedKey.split('.').length > 1 &&
						pageFormData[nestedKey][index]?.map(item => {
							return <ListFieldItem item={item} />
						})
				}
				{
					nestedKey.split('.').length > 1 &&
						!pageFormData[nestedKey][index]?.length &&
							'No items chosen'
				}
			</Box>
			<Button
				width='fit-content'
				onClick={() => {
					setFormSelected(prev => {
						return {
							...prev,
							formIndex: prev.formIndex + 1
						}
					})
				}}
			>
				Create New {obj.caster.options.ref}
			</Button>
			<Box
				outline='black solid .1rem'
				borderRadius='.2rem'
				height='300px'
				overflow='auto'
				my='1rem'
				padding='.5rem'
			>
				{
					items?.map(item => {
						return <ListFieldItem item={item} />
					})
				}
				{
					!items?.length && 'No items to choose'
				}
			</Box>
		</Flex>
	)
}

export default ListField;