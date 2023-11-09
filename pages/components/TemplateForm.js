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
import { useManagePageForm } from '../contexts/useManagePageForm';

const TemplateForm = ({}) => {
	const router = useRouter()
	const { title: uTitle, description: uDescription, price: uPrice, link: uLink, update, _id } = router.query;
	const [templateFormData, setTemplateFormData] = useState({});
	const [fieldArr, setFieldArr] = useState(null);
	let [success, setSuccess] = useState(false);
	let [error, setError] = useState('');
	let [loading, setLoading] = useState(false);
	let [id, setId] = useState(null);
	let [openModal, setOpenModal] = useState(false);
	let [assetFormOpen, setAssetFormOpen] = useState(false);
	let fileInputRef = useRef(null)
	const { formSelected, setFormSelected } = useManagePageForm();

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
			setFieldArr(Object.entries(schemaPaths))
		}
	}, [])

	const props = {
		width: '1200',
		height: '800',
		className: 'w-100',
		src: uLink,
		alt: 'post image'
	};

	useEffect(() => {
		if (success && id) {
			router.push(`/posts/${id}`)
		}
	}, [success, id]);

	function reset() {
		setFile('');
		fileInputRef.current.value = ''
		setTitle('');
		setDescription('');
		setPrice('');
		setError('');
	}
	if (formSelected.formFlow[formSelected.formIndex] === 'Templates') {
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
								...data,
								update
							})
						});
						setLoading(false)
						if (res2.ok) {
							const data = await res2.json()
							setId(data._id)
							reset();
							setSuccess(true);
						} else {
							const data = await res2.json();
							console.log('Error in TemplateForm', data.errorMessage);
							setError(data.errorMessage);
						}
					}}
				>
					<FormFields fieldArr={fieldArr} nestedKey='templates' />
				</form>
				<Flex

				>
					<Button type='submit'>Save</Button>
					<Button type='submit'>Save And New</Button>
					<Button
						colorScheme='blue'
						mr={3}
						onClick={() => {
							setFormSelected(prev => {
								return {
									...prev,
									formIndex: prev.formIndex - 1
								}
							})
						}}
					>
						Close New Template Form
					</Button>
				</Flex>
			</div>
		);
	} else {
		return <></>;
	}
};

export default TemplateForm;
