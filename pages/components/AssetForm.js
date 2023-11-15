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
	Flex,
	FormControl,
	FormLabel
} from '@chakra-ui/react'
import axios from 'axios';
import mongoose from 'mongoose';
import FormFields, { resetData } from './FormFields';
import { useManagePageForm } from '../contexts/useManagePageForm';
import { cloneDeep } from 'lodash';

const AssetForm = ({}) => {
	const router = useRouter()
	const { title: uTitle, description: uDescription, price: uPrice, link: uLink, update, _id } = router.query;
	const [templateFormData, setTemplateFormData] = useState({});
	const [fieldArr, setFieldArr] = useState([]);
	let [success, setSuccess] = useState(false);
	let [error, setError] = useState([]);
	let [loading, setLoading] = useState(false);
	let [id, setId] = useState(null);
	let [saveType, setSaveType] = useState(null);
	let [openModal, setOpenModal] = useState(false);
	let fileInputRef = useRef(null);
	const { formSelected, setFormSelected, data, setData } = useManagePageForm();
	const { formTitle, editItemTraceObj } = formSelected;

	useEffect(() => {
		handleModelSchema();
		async function handleModelSchema() {
			if (formTitle !== 'Assets') return;
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
		assetKey: '',
		assetFile: '',
		assetDataUrl: '',
		assetDimensions: [],
		thumbnailKey: '',
		thumbnailFile: '',
		thumbnailDataUrl: '',
		thumbnailDimensions: [],
		title: '',
		description: '',
		type: ''
	}

	useEffect(() => {
		if (success && id) {
			router.push(`/posts/${id}`)
		}
	}, [success, id]);

	if (formTitle === 'Assets') {
		return (
			<div className="form container">
				<Text as='h2'>New Asset</Text>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						setLoading(true);
						let url;
						let dataRef = data[formTitle];
						let fieldObj;
						let fieldTitle;
						let file;
						let oldKey;
						for (let i = 0; i < fieldArr.length; i++) {
							fieldTitle = fieldArr[i][0];
							fieldObj = fieldArr[i][1];
							file = data[formTitle][fieldObj.options.dataFormKey];
							if (!file) continue;
							if (formSelected.update && data[formTitle][fieldTitle]) {
								const res = await fetch(`/api/handle_s3_url`, {
									method: 'DELETE',
									headers: {
										Accept: 'application/json',
										'Content-Type': 'application/json'
									},
									body: JSON.stringify({
										keysToDelete: [data[formTitle][fieldTitle]]
									})
								});
								if (!res.ok) {
									const data = await res2.json();
									console.log(data);
									console.log('S3 Delete Failed, object keys:', keysToDelete);
								}
							}
							const res = await fetch(`/api/handle_s3_url`, {
								method: 'POST',
								headers: {
									Accept: 'application/json',
									'Content-Type': 'application/json'
								},
								body: JSON.stringify({
									name: file.name,
									type: file.type
								})
							});
							const data1 = await res.json()
							const { url, key } = data1;
							dataRef[fieldTitle] = key
							try {
								await axios.put(url, file, {
									headers: {
										'Content-Type': file.type,
										'Access-Control-Allow-Origin': '*'
									},
								});
							} catch (err) {
								console.log('Axios Error:', err)
							}
						}
						const res2 = await fetch(`/api/handle_asset`, {
							method: 'POST',
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								data: dataRef,
								update: formSelected.update,
								itemToEditId: editItemTraceObj[formTitle]
							})
						});
						if (res2.ok) {
							const data = await res2.json()
							const { savedAssetId } = data;
							setData(prev => {
								const newData = cloneDeep(prev);
								newData['Templates'].assetsIds.push(savedAssetId)
								newData['Assets'] = resetObj;
								if (saveType === 'Save') {
									setFormSelected(prev => {
										return {
											...prev,
											formTitle: 'Templates',
											prevFormTitle: 'Assets'
										}
									})
								}
								return newData;
							})
							if (formSelected.update) {
								setFormSelected(prev => {
									const newData = cloneDeep(prev);
									newData.update = '';
									newData.editItemTraceObj['Assets'] = '';
									return newData;
								})
							}
							setSuccess(true);
						} else {
							const data = await res2.json();
							console.log('Error in AssetForm', data.errorMessage);
							setError(data.errorMessage);
						}
						setLoading(false)
					}}
				>
					<FormFields fieldArr={fieldArr} />
					{loading && <Spinner />}
					<Flex
						my='1rem'
					>
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
							mt='.2rem'
							mr={3}
							onClick={() => {
								setData(prev => {
									const newData = cloneDeep(prev);
									newData['Assets'] = resetObj;
									return newData;
								})
								setFormSelected(prev => {
									const newData = cloneDeep(prev);
									newData.formTitle = 'Templates';
									newData.prevFormTitle = 'Assets';
									newData.update = newData.editItemTraceObj['Templates'] ? 'Templates' : '';
									newData.editItemTraceObj['Assets'] = '';
									return newData;
								})
							}}
						>
							Go back to Templates
						</Button>
					</Flex>
				</form>
			</div>
		);
	} else {
		return <></>;
	}
};

export default AssetForm;
