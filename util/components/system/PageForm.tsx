import { useState, useEffect } from 'react';
import {
	Button,
	Text,
	Heading
} from '@chakra-ui/react';
import FormFields from './FormFields';
import { useManagePageForm, dataInitialValue } from '../../contexts/useManagePageForm';
import { cloneDeep, kebabCase, remove, last } from 'lodash';

const PageForm = ({}) => {
	const [fieldArr, setFieldArr] = useState<[string, any][]>([]);
	let [error, setError] = useState('');
	const { data, setData, formSelected, setFormSelected, setTopLevelModal } = useManagePageForm();
	const { formTitle, editItemTraceObj } = formSelected;

	useEffect(() => {
		handleModelSchema();
		async function handleModelSchema() {
			const res = await fetch(`/api/get_model_schema?formTitle=${formTitle}`);
			const data = await res.json();
			const { schemaPaths } = data;
			setFieldArr(Object.entries(schemaPaths))
		}
	}, [])

	if (formTitle === 'Page') {
		return (
			<div className="form container">
				<Heading>
					{
						((
							formSelected.nestedItemTraceObj['Page'].length &&
							formTitle === 'Page'
						) ||
							!editItemTraceObj['Page']) ?
								`New Page${formSelected.nestedItemTraceObj['Page'].length ? ' for ' + (last(formSelected.nestedItemTraceObj['Page']) as any).folderHref : ''} ` :
									'Update Page'
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
						if (formSelected.nestedItemTraceObj['Page'].length) {
							data['Page'].folderHref =
								formSelected.nestedItemTraceObj['Page']
									.map((obj: any) => obj.folderHref)
										.push(`/${kebabCase(data['Page'].title)}`)
											.join('')
						} else {
							data['Page'].folderHref = `/${kebabCase(data['Page'].title)}`;
						}
						const res2 = await fetch(`/api/handle_page`, {
							method: formSelected.update === 'Page' ? 'PUT' : 'POST',
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
								folderHref: data['Page']?.folderHref
							})
						});

						if (res2.ok) {
							const data = await res2.json()
							const { savedAssetId } = data;
							if (formSelected.nestedItemTraceObj['Page'].length) {
								setFormSelected(prev => {
									const newData1 = cloneDeep(prev);
									newData1.formTitle = 'Page';
									newData1.update = 'Page';
									newData1.loading = false;
									setData(prev => {
										const newData2 = cloneDeep(prev);
										newData2['Page'] = last(newData1.nestedItemTraceObj['Page']);
										newData2['Page'].childPagesIds.push(savedAssetId);
										return newData2;
									})
									newData1.nestedItemTraceObj['Page'].pop();
									return newData1;
								})
							} else {
								setFormSelected(prev => {
									const newData = cloneDeep(prev);
									newData.formTitle = 'Page';
									newData.update = '';
									newData.loading = false;
									return newData;
								})
								setTopLevelModal(false);
								setData(dataInitialValue);
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
					<Button
						type='submit'
						isDisabled={formSelected.loading}
					>
						{editItemTraceObj['Page'] ? 'Update' : 'Save'}
					</Button>
				</form>
			</div>
		);
	} else {
		return <></>
	}
};

export default PageForm;
