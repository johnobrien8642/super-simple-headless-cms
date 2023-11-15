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
import { capitalize, cloneDeep, sortBy } from 'lodash';
import { useDrop, useDragDropManager, useDragLayer } from 'react-dnd';

const ListField = ({ obj, title }) => {
	const [availableItems, setAvailableItems] = useState([]);
	const [chosenItems, setChosenItems] = useState([]);
	const [open, setOpen] = useState(false);
	const [itemIndex, setItemIndex] = useState(null);
	const [loading, setLoading] = useState(false);
	const { formSelected, setFormSelected, data,  setData } = useManagePageForm();
	const { formTitle } = formSelected;
	const dragDropMgr = useDragDropManager();

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
					nestedItemIds: data?.[formTitle]?.[title] ?? []
				})
			})
			const resData = await res.json();
			const { availableItems, chosenItems } = resData;
			setAvailableItems(availableItems);
			setChosenItems(chosenItems);
		}
	}, [data, formTitle])

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
					chosenItems?.map((item, index) => {
						return <ListFieldItem
							key={item._id}
							item={item}
							title={title}
							chosen='true'
							type={formTitle}
							index={index}
							setChosenItems={setChosenItems}
							chosenItems={chosenItems}
						/>
					})
				}
				{
					!chosenItems?.length && 'No items to choose, but this works'
				}
			</Box>
			<Button
				width='fit-content'
				onClick={() => {
					setFormSelected(prev => {
						return {
							...prev,
							formTitle: obj.caster.options.ref,
							prevFormTitle: prev.formTitle
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
					availableItems?.map(item => {
						return <ListFieldItem
							key={item._id}
							item={item}
							title={title}
							chosen='false'
							type={formTitle}
							setAvailableItems={setAvailableItems}
						/>
					})
				}
				{
					!availableItems?.length && 'No items to choose, but this works'
				}
			</Box>
		</Flex>
	)
}

export default ListField;