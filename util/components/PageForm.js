import Image from 'next/image'
import { useRouter } from 'next/router';
import { useState, useEffect, useRef } from 'react';
import {
	Button,
	Spinner,
	Text
} from '@chakra-ui/react'
import axios from 'axios';
import mongoose from 'mongoose';
import FormFields from './FormFields';
import TemplateForm from './TemplateForm';
import { useManagePageForm, dataInitialValue } from '../contexts/useManagePageForm';
import { cloneDeep, kebabCase } from 'lodash';

const PageForm = ({}) => {
	const router = useRouter()
	const { title: uTitle, description: uDescription, price: uPrice, link: uLink, update, _id } = router.query;
	const [fieldArr, setFieldArr] = useState(null);
	let [success, setSuccess] = useState(false);
	let [error, setError] = useState('');
	let [loading, setLoading] = useState(false);
	let [id, setId] = useState(null);
	let fileInputRef = useRef(null)
	const { data, setData, formSelected, setFormSelected, setTopLevelModal } = useManagePageForm();
	const { formTitle, editItemTraceObj } = formSelected;

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
					schema: formTitle
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
		// setFile('');
		// fileInputRef.current.value = ''
		// setTitle('');
		// setDescription('');
		// setPrice('');
		// setError('');
	}

	if (formTitle === 'Page') {
		return (
			<div className="form container">
				<Text as='h2'>{editItemTraceObj['Page'] ? 'Update Page' : 'New Page'}</Text>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						setLoading(true);
						data['Page'].folderHref = `/${kebabCase(data['Page'].title)}`;
						const res2 = await fetch(`/api/page_create`, {
							method: 'POST',
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								data: {
									...data['Page']
								},
								update: formSelected.update,
								itemToEditId: editItemTraceObj[formTitle]
							})
						});
						setLoading(false)
						if (res2.ok) {
							const data = await res2.json()
							if (formSelected.update === 'Page') {
								setFormSelected(prev => {
									const newData = cloneDeep(prev);
									newData.formTitle = 'Page';
									newData.update = '';
									return newData;
								})
							}
							setTopLevelModal(false);
							setData(dataInitialValue)
							setSuccess(true);
						} else {
							const data = await res2.json();
							console.log('Error in PageForm', data.errorMessage);
							setError(data.errorMessage);
						}
					}}
				>
					<FormFields fieldArr={fieldArr} dataKey='Templates' />
					<Button type='submit'>{editItemTraceObj['Page'] ? 'Update' : 'Save'}</Button>
				</form>
			</div>
		);
	} else {
		return <></>
	}
};

export default PageForm;
