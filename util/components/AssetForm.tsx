import { useState, useEffect } from 'react';
import {
	Button,
	Text,
	Flex,
	Heading
} from '@chakra-ui/react'
import axios from 'axios';
import FormFields from './FormFields';
import { initialValueObj, useManagePageForm, FormSelectedType, ManagePageFormDataType, dataInitialValue } from '../contexts/useManagePageForm';
import { OptionsType } from '../../models/model-types';
import { cloneDeep } from 'lodash';

const AssetForm = ({}) => {
	const [fieldArr, setFieldArr] = useState<[string, any][]>([]);
	let [error, setError] = useState('');
	let [saveType, setSaveType] = useState('');
	const { formSelected, setFormSelected, data, setData } = useManagePageForm();
	const { formTitle, editItemTraceObj } = formSelected;

	useEffect(() => {
		handleModelSchema();
		async function handleModelSchema() {
			const res = await fetch(`/api/get_model_schema?formTitle=${formTitle}`);
			const data = await res.json();
			const { schemaPaths } = data;
			setFieldArr(Object.entries(schemaPaths))
		}
	}, [formTitle]);

	if (formTitle === 'Assets') {
		return (
			<div className="form container">
				<Heading>{editItemTraceObj['Assets'] ? 'Update Asset' : 'New Asset'}</Heading>
				<Heading>{`(${data['Templates'].type})`}</Heading>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						setFormSelected((prev) => {
							const newData = cloneDeep(prev);
							newData.loading = true;
							return newData;
						});
						let dataRef: ManagePageFormDataType = data[formTitle];
						let fieldTitle: string;
						let fieldObjOptions: OptionsType;
						let file;
						if (data[formTitle].type === 'Image') {
							for (let i = 0; i < fieldArr.length; i++) {
								fieldTitle = fieldArr[i][0];
								fieldObjOptions = fieldArr[i][1].options;
								file = data[formTitle][fieldObjOptions.dataFormKey ?? ''];
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
						}
						if (dataRef.type !== 'PDF' && dataRef.assetDataUrl) {
							delete dataRef.assetDataUrl;
						}
						const res2 = await fetch(`/api/handle_asset`, {
							method: formSelected.update === 'Assets' ? 'PUT' : 'POST',
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								data: dataRef,
								update: formSelected.update,
								itemToEditId: editItemTraceObj[formTitle],
								folderHref: data['Page']?.folderHref
							})
						});
						if (res2.ok) {
							const data = await res2.json()
							const { savedAssetId } = data;
							setData(prev => {
								const newData = cloneDeep(prev);
								if (!formSelected.editItemTraceObj['Assets']) {
									newData['Templates'].assetsIds.push(savedAssetId)
								}
								newData['Assets'] = initialValueObj['Assets'];
								if (saveType === 'Save') {
									setFormSelected(prev => {
										const newData = cloneDeep(prev);
										newData.formTitle = 'Templates';
										newData.prevFormTitle = 'Assets';
										newData.loading = false;
										return newData;
									});
								}
								return newData;
							})
							if (formSelected.update === 'Assets') {
								setFormSelected(prev => {
									const newData = cloneDeep(prev);
									newData.update = newData.editItemTraceObj['Templates'] ? 'Templates' : '';
									newData.editItemTraceObj['Assets'] = '';
									newData.loading = false;
									return newData;
								})
							}
						} else {
							const data = await res2.json();
							console.log('Error in AssetForm', data.errorMessage);
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
					<Flex
						my='1rem'
					>
						<Button
							type='submit'
							mr='1rem'
							onClick={() => {
								setSaveType('Save')
							}}
							isDisabled={formSelected.loading}
						>
							{editItemTraceObj['Assets'] ? 'Update' : 'Save'}
						</Button>
						{!editItemTraceObj['Assets'] && <Button
							mr='1rem'
							type='submit'
							onClick={() => {
								setSaveType('Save and New')
							}}
							isDisabled={formSelected.loading}
						>
							Save and New
						</Button>}
						<Button
							colorScheme='blue'
							mt='.2rem'
							mr={3}
							onClick={() => {
								setData(prev => {
									const newData = cloneDeep(prev);
									newData['Assets'] = dataInitialValue['Assets'];
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
							isDisabled={formSelected.loading}
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
