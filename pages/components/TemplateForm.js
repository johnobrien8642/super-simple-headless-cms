import Image from 'next/image'
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import {
	Button,
	Modal,
	ModalHeader,
	ModalCloseButton,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalFooter,
	Spinner,
	Text,
	Flex
} from '@chakra-ui/react'
import axios from 'axios';
import mongoose from 'mongoose';
import FormFields from './FormFields';
import AssetForm from './AssetForm';
import { useManagePageForm, dataInitialValue } from '../contexts/useManagePageForm';
import { clone, cloneDeep } from 'lodash';

const TemplateForm = ({}) => {
	const router = useRouter()
	const { title: uTitle, description: uDescription, price: uPrice, link: uLink, update, _id } = router.query;
	const [templateFormData, setTemplateFormData] = useState({});
	const [fieldArr, setFieldArr] = useState(null);
	const [saveType, setSaveType] = useState('');
	let [success, setSuccess] = useState(false);
	let [error, setError] = useState('');
	let [loading, setLoading] = useState(false);
	let [id, setId] = useState(null);
	let [openModal, setOpenModal] = useState(false);
	let [assetFormOpen, setAssetFormOpen] = useState(false);
	let fileInputRef = useRef(null)
	const { formSelected, setFormSelected, data, setData } = useManagePageForm();
	const { formTitle, editItemTraceObj } = formSelected;

	useEffect(() => {
		handleModelSchema();
		async function handleModelSchema() {
			if (formTitle !== 'Templates') return;
			const res = await fetch('/api/get_model_schema',
			{
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					schema: formTitle
				})
			})
			const data = await res.json();
			const { schemaPaths } = data;
			setFieldArr(Object.entries(schemaPaths))
		}
	}, [formTitle])

	const props = {
		width: '1200',
		height: '800',
		className: 'w-100',
		src: uLink,
		alt: 'post image'
	};

	const resetObj = {
		title: '',
		type: '',
		description: '',
		assetsIds: []
	};

	if (formTitle === 'Templates') {
		return (
			<div className="form container">
				<Text as='h2'>New Template</Text>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						setLoading(true);
						const res2 = await fetch(`/api/template_create`, {
							method: 'POST',
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								data: data['Templates'],
								update: formSelected.update,
								itemToEditId: editItemTraceObj[formTitle]
							})
						});
						setLoading(false)
						if (res2.ok) {
							const resData = await res2.json();
							const { templateId } = resData;
							setData(prev => {
								const newData = cloneDeep(prev);
								if (!formSelected.update) {
									newData['Page'].templatesIds.push(templateId);
								}
								newData['Templates'] = resetObj;
								if (saveType === 'Save') {
									setFormSelected(prev => {
										return {
											...prev,
											formTitle: 'Page',
											prevFormTitle: 'Templates',
										}
									})
								}
								setSaveType('');
								return newData;
							})
							if (formSelected.update) {
								setFormSelected(prev => {
									const newData = cloneDeep(prev);
									newData.update = '';
									editItemTraceObj['Templates'] = '';
									return newData;
								})
							}
						} else {
							const data = await res2.json();
							console.log('Error in TemplateForm', data.errorMessage);
							setError(data.errorMessage);
						}
					}}
				>
					<FormFields fieldArr={fieldArr} dataKey='Assets' />
					<Flex>
						<Button
							type='submit'
							onClick={() => {
								setSaveType('Save')
							}}
						>
							Save
						</Button>
						<Button
							mx='1rem'
							type='submit'
							onClick={() => {
								setSaveType('Save and New')
							}}
						>
							Save and New
						</Button>
						<Button
							colorScheme='blue'
							mr={3}
							onClick={() => {
								setData(prev => {
									const newData = cloneDeep(prev);
									newData['Templates'] = resetObj;
									return newData;
								})
								setFormSelected(prev => {
									const newData = cloneDeep(prev);
									newData.formTitle = 'Page';
									newData.prevFormTitle = 'Templates';
									newData.update = newData.editItemTraceObj['Page'] ? 'Page' : '';
									newData.editItemTraceObj['Templates'] = '';
									return newData;
								})
							}}
						>
							Go back to Page
						</Button>
					</Flex>
				</form>
			</div>
		);
	} else {
		return <></>;
	}
};

export default TemplateForm;
