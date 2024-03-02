import { useState, useEffect } from 'react';
import {
	Button,
	Text,
	Flex,
	Heading
} from '@chakra-ui/react';
import FormFields from './FormFields';
import { useManagePageForm, initialValueObj } from '../../contexts/useManagePageForm';
import { cloneDeep } from 'lodash';

const TemplateForm = ({}) => {
	const [fieldArr, setFieldArr] = useState<[string, any][]>();
	const [saveType, setSaveType] = useState('');
	let [error, setError] = useState('');
	const { formSelected, setFormSelected, data, setData } = useManagePageForm();
	const { formTitle, editItemTraceObj, parentFieldTitle } = formSelected;

	useEffect(() => {
		handleModelSchema();
		async function handleModelSchema() {
			const res = await fetch(`/api/get_model_schema?formTitle=${formTitle}`);
			const data = await res.json();
			const { schemaPaths } = data;
			setFieldArr(Object.entries(schemaPaths))
		}
	}, [formTitle])

	if (formTitle === 'Templates') {
		return (
			<div className="form container">
				<Heading>{editItemTraceObj['Templates'] ? 'Update Template' : 'New Template'}</Heading>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						setFormSelected(prev => {
							const newData = cloneDeep(prev);
							newData.loading = true;
							return newData;
						});
						const res2 = await fetch(`/api/handle_template`, {
							method: data['Templates']._id ? 'PUT' : 'POST',
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								data: data['Templates'],
								update: formSelected.update,
								itemToEditId: editItemTraceObj[formTitle],
								folderHref: data['Page']?.folderHref
							})
						});
						if (res2.ok) {
							const resData = await res2.json();
							const { templateId } = resData;
							setData(prev => {
								const newData = cloneDeep(prev);
								newData['Templates'] = initialValueObj['Templates'];
								if (!formSelected.editItemTraceObj['Templates']) {
									newData['Page'][parentFieldTitle].push(templateId);
								}
								if (saveType === 'Save') {
									setFormSelected(prev => {
										const newData = cloneDeep(prev);
										newData.formTitle = 'Page';
										newData.prevFormTitle = 'Templates';
										newData.loading = false;
										return newData;
									});
								}
								setSaveType('');
								return newData;
							});
							if (formSelected.update === 'Templates') {
								setFormSelected(prev => {
									const newData = cloneDeep(prev);
									newData.update = newData.editItemTraceObj['Page'] ? 'Page' : '';
									newData.editItemTraceObj['Templates'] = '';
									newData.loading = false;
									return newData;
								});
							}
						} else {
							const data = await res2.json();
							console.log('Error in TemplateForm', data.errorMessage);
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
							mr='1rem'
							onClick={() => {
								setSaveType('Save')
							}}
							isDisabled={formSelected.loading}
						>
							{editItemTraceObj['Templates'] ? 'Update' : 'Save'}
						</Button>
						{!editItemTraceObj['Templates'] && <Button
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
							mr={3}
							onClick={() => {
								setData(prev => {
									const newData = cloneDeep(prev);
									newData['Templates'] = initialValueObj['Templates'];
									return newData;
								})
								setFormSelected(prev => {
									const newData = cloneDeep(prev);
									newData.formTitle = 'Page';
									newData.prevFormTitle = 'Templates';
									newData.update = newData.editItemTraceObj['Page'] ? 'Page' : '';
									newData.editItemTraceObj['Templates'] = '';
									newData.loading = false;
									return newData;
								})
							}}
							isDisabled={formSelected.loading}
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
