import { useState, useEffect } from 'react';
import {
	Button,
	Text,
	Heading,
	Flex
} from '@chakra-ui/react';
import FormFields from './FormFields';
import { useManagePageForm, ManagePageFormDataType, dataInitialValue } from '../../contexts/useManagePageForm';
import { OptionsType } from '../../../models/model-types';
import { cloneDeep, kebabCase } from 'lodash';
import axios from 'axios';

const Form = ({}) => {
	const [fieldArr, setFieldArr] = useState<[string, any][]>([]);
	const [parentDoc, setParentDoc] = useState<any | null>(null);
	let [error, setError] = useState('');
	const {
		data,
		setData,
		formSelected,
		setFormSelected,
		setTopLevelModal,
		topLevelModal,
		formCache,
		setFormCache
	} = useManagePageForm();
	const formTitle = formCache[formCache.active]?.formTitle ?? '';

	useEffect(() => {
		handleModelSchema();
		async function handleModelSchema() {
			if (!topLevelModal) return;
			const res = await fetch(`/api/get_model_schema?formTitle=${formTitle}`);
			const data = await res.json();
			const { schemaPaths } = data;
			setFieldArr(Object.entries(schemaPaths))
		}
	}, [formCache]);

	function resolveHeading() {
		let activeItem = formCache[formCache?.active];
		let previousItem = formCache[activeItem?.previous];
		return `${activeItem?.update? 'Edit ' : 'Create '}${activeItem?.formTitle}${previousItem ? ` for ${previousItem?.formTitle}` : ''}`
	}

	return (
		<div className="form container">
			<Heading>
				{resolveHeading()}
			</Heading>
			<form
				onSubmit={async (e) => {
					e.preventDefault();
					setFormSelected(prev => {
						const newData = cloneDeep(prev);
						newData.loading = true;
						return newData;
					});
					if (data[formTitle].formTitle === 'Page') {
						data['Page'].folderHref = `/${kebabCase(data['Page'].title)}`;
					} else if (data[formTitle].formTitle === 'Assets') {
						let dataRef: ManagePageFormDataType = data[formTitle];
						let fieldTitle: string;
						let fieldObjOptions: OptionsType;
						let file;
						if (
							data[formTitle].type === 'Image' ||
							data[formTitle].type === 'Video' ||
							data[formTitle].type === 'PDF'
						) {
							for (let i = 0; i < fieldArr.length; i++) {
								fieldTitle = fieldArr[i][0];
								fieldObjOptions = fieldArr[i][1].options;
								file = data[formTitle][fieldObjOptions.dataFormKey ?? ''];
								if (!file) continue;
								if (data.update && data[formTitle][fieldTitle]) {
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
										const data = await res.json();
										const { errors } = data;
										console.log(data);
										console.log('S3 Delete Failed, object keys:', errors);
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
								dataRef[fieldTitle] = process.env.NEXT_PUBLIC_DOCKER === 'true' ? `${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}/` + key : key;
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
						}
						if (dataRef.type !== 'PDF' && dataRef.assetDataUrl) {
							delete dataRef.assetDataUrl;
						}
						console.log(dataRef)
						data[formTitle] = dataRef;
					}
					const res2 = await fetch(`/api/handle_item`, {
						method: data[formTitle].update ? 'PUT' : 'POST',
						headers: {
							Accept: 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							data: {
								...data[formTitle]
							},
							folderHref: data[formTitle]?.folderHref
						})
					});

					if (res2.ok) {
						const data = await res2.json()
						const { parent, parentFieldTitleRef, savedItem } = data;
						const activeItem = formCache[formCache.active];
						let previousFormTitle: string;
						if (!activeItem?.previous) {
							setTopLevelModal(false);
							setData(cloneDeep(dataInitialValue));
							setFormCache({});
						} else {
							previousFormTitle = formCache[activeItem.previous].formTitle;
							setFormCache(prev => {
								const newFormCacheData = cloneDeep(prev);
								setData(prev => {
									const newData = cloneDeep(prev);
									newData[previousFormTitle] = {
										...newFormCacheData[activeItem.previous]
									};
									if (parentFieldTitleRef && savedItem) {
										newData[previousFormTitle][parentFieldTitleRef].push(savedItem._id);
									}
									newFormCacheData.active = activeItem.previous;
									delete newFormCacheData[activeItem._id];
									return newData;
								})
								return newFormCacheData;
							})
						}
						setFormSelected(prev => {
							const newData = cloneDeep(prev);
							newData.loading = false;
							return newData;
						});
					} else {
						const data = await res2.json();
						console.log('Error in Form', data.errorMessage);
						setFormSelected(prev => {
							const newData = cloneDeep(prev);
							newData.loading = false;
							return newData;
						});
						setError(data.errorMessage);
					}
				}}
			>
				<FormFields fieldArr={fieldArr} />
				{
					error &&
						<Text
							color='red'
							my='1rem'
						>
							{`Something went wrong: ${error}`}
						</Text>
				}
				<Flex>
					<Button
						type='submit'
						isDisabled={formSelected.loading}
						mr={3}
					>
						{data[formTitle]?.update ? 'Update' : 'Save'}
					</Button>
					{formCache[formCache.active]?.previous &&
						<Button
							colorScheme='blue'
							mr={3}
							onClick={() => {
								setFormCache(prev => {
									const newCacheData = cloneDeep(prev);
									const activeItem = newCacheData[newCacheData.active];
									setData(prev => {
										const newData = cloneDeep(prev);
										newData[activeItem.formTitle] = cloneDeep(newCacheData[activeItem.previous]);
										return newData;
									})
									newCacheData.active = activeItem.previous;
									return newCacheData;
								});
							}}
							isDisabled={formSelected.loading}
						>
							Cancel
						</Button>
					}
				</Flex>
			</form>
		</div>
	);
};

export default Form;
