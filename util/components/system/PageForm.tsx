import { useState, useEffect } from 'react';
import {
	Button,
	Text,
	Heading,
	Flex
} from '@chakra-ui/react';
import FormFields from './FormFields';
import { useManagePageForm, dataInitialValue } from '../../contexts/useManagePageForm';
import { cloneDeep, kebabCase } from 'lodash';

const PageForm = ({}) => {
	const [fieldArr, setFieldArr] = useState<[string, any][]>([]);
	const [parentDoc, setParentDoc] = useState<any | null>(null);
	let [error, setError] = useState('');
	const { data, setData, formSelected, setFormSelected, setTopLevelModal } = useManagePageForm();
	const { formTitle, editItemTraceObj, parentId } = formSelected;

	useEffect(() => {
		handleModelSchema();
		async function handleModelSchema() {
			const res = await fetch(`/api/get_model_schema?formTitle=${formTitle}`);
			const data = await res.json();
			const { schemaPaths } = data;
			setFieldArr(Object.entries(schemaPaths))
		}
	}, []);

	useEffect(() => {
		getParent();
		async function getParent() {
			if (!data[formTitle]?._id) return;
			const res = await fetch(`/api/get_parent?formTitle=${formTitle}&id=${data[formTitle]._id.toString()}`);
			const resData = await res.json();
			const { parent } = resData;
			setParentDoc(parent);
		}
	}, [formSelected]);

	if (formTitle === 'Page') {
		return (
			<div className="form container">
				<Heading>
					{
						parentDoc ?
							`Child Page for ${parentDoc.title}` :
								`Top Level Page: ${data['Page']?.title || ''}`
					}
				</Heading>
				<form
					onSubmit={async (e) => {
						e.preventDefault();
						setFormSelected(prev => {
							const newData = cloneDeep(prev);
							newData.loading = true;
							return newData;
						});
						data['Page'].folderHref = `/${kebabCase(data['Page'].title)}`;
						const res2 = await fetch(`/api/handle_page`, {
							method: data['Page']._id ? 'PUT' : 'POST',
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								data: {
									...data['Page']
								},
								update: formSelected.update,
								itemToEditId: editItemTraceObj[formTitle],
								folderHref: data['Page']?.folderHref,
								parentId
							})
						});

						if (res2.ok) {
							const data = await res2.json()
							const { parent } = data;
							setFormSelected(prev => {
								const newData = cloneDeep(prev);
								newData.formTitle = 'Page';
								newData.update = '';
								newData.loading = false;
								newData.parentId = '';
								return newData;
							})
							if (parent) {
								setData(prev => {
									const newData = cloneDeep(prev);
									newData[formTitle] = cloneDeep(parent);
									return newData;
								})
							} else {
								setTopLevelModal(false);
								setData(cloneDeep(dataInitialValue));
							}
						} else {
							const data = await res2.json();
							console.log('Error in PageForm', data.errorMessage);
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
							{data['Page']._id ? 'Update' : 'Save'}
						</Button>
						{parentDoc &&
							<Button
								colorScheme='blue'
								mr={3}
								onClick={() => {
									setFormSelected(prev => {
										return cloneDeep(prev);
									});
									setData(prev => {
										const newData = cloneDeep(prev);
										newData['Page'] = parentDoc;
										return newData;
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
	} else {
		return <></>
	}
};

export default PageForm;
