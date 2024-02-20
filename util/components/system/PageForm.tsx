import { useState, useEffect } from 'react';
import {
	Button,
	Text,
	Heading,
	Flex
} from '@chakra-ui/react';
import FormFields from './FormFields';
import { useManagePageForm, dataInitialValue, formSelectedInitObj, nestedItemTraceObjInitObj, initialValueObj } from '../../contexts/useManagePageForm';
import { cloneDeep, kebabCase, remove, last, first } from 'lodash';

const PageForm = ({}) => {
	const [fieldArr, setFieldArr] = useState<[string, any][]>([]);
	let [error, setError] = useState('');
	const { data, setData, formSelected, setFormSelected, setTopLevelModal } = useManagePageForm();
	const { formTitle, editItemTraceObj, nestedItemTraceObj, update, loading } = formSelected;

	useEffect(() => {
		handleModelSchema();
		async function handleModelSchema() {
			if (!formTitle) return;
			const res = await fetch(`/api/get_model_schema?formTitle=${formTitle}`);
			const data = await res.json();
			const { schemaPaths } = data;
			setFieldArr(Object.entries(schemaPaths))
		}
	}, [formTitle])

	if (formTitle === 'Page') {
		return (
			<div className="form container">
				<Heading>
					{
						((
							nestedItemTraceObj['Page'].length &&
							formTitle === 'Page'
						) ||
							!editItemTraceObj['Page']) ?
								`New Page${nestedItemTraceObj['Page'].length ? ' for ' + (last(nestedItemTraceObj['Page']) as any).folderHref : ''} ` :
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
						if (nestedItemTraceObj['Page'].length) {
							nestedItemTraceObj['Page']
								.push({ folderHref: `/${kebabCase(data['Page'].title)}` });
							data['Page'].folderHref =
								nestedItemTraceObj['Page']
									.filter((obj: any) => obj.folderHref !== '/')
										.map((obj: any) => obj.folderHref)
											.join('');
						} else {
							data['Page'].folderHref = `/${kebabCase(data['Page'].title)}`;
						}
						nestedItemTraceObj['Page'].pop();
						const res2 = await fetch(`/api/handle_page`, {
							method: data['Page']?._id ? 'PUT' : 'POST',
							headers: {
								Accept: 'application/json',
								'Content-Type': 'application/json'
							},
							body: JSON.stringify({
								data: {
									...data['Page']
								},
								update: update,
								isNested: !!nestedItemTraceObj['Page'].length,
								parentId: !data['Page']._id ?
									(last(nestedItemTraceObj['Page']) as any)?._id :
										nestedItemTraceObj['Page'].at(-2),
								itemToEditId: editItemTraceObj[formTitle],
								folderHref: data['Page']?.folderHref
							})
						});

						if (res2.ok) {
							const data = await res2.json()
							const { _id } = data;
							if (nestedItemTraceObj['Page'].length === 1) {
								setTopLevelModal(false);
								setData(cloneDeep(dataInitialValue));
								setFormSelected(cloneDeep(formSelectedInitObj))
							} else {
								setFormSelected(prev => {
									const newData1 = cloneDeep(prev);
									newData1.formTitle = 'Page';
									newData1.update = 'Page';
									setData(prev => {
										const newData2 = cloneDeep(prev);
										newData2['Page'] = newData1.nestedItemTraceObj['Page'].at(-2);
										if (!data['Page'] ?._id) {
											newData2['Page'].childPagesIds.push(_id);
										}
										return newData2;
									})
									newData1.nestedItemTraceObj['Page'].pop();
									newData1.loading = false;
									return newData1;
								})
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
					<Flex
						my='1rem'
					>

						<Button
							type='submit'
							isDisabled={loading}
							mr='1rem'
						>
							{editItemTraceObj['Page'] && data['Page']?._id ? 'Update' : 'Save'}
						</Button>
						<Button
							colorScheme='blue'
							mt='.2rem'
							mr={3}
							onClick={() => {
								setData(prev => {
									const newData = cloneDeep(prev);
									if (nestedItemTraceObj['Page'].length > 1) {
										newData['Page'] = nestedItemTraceObj['Page'].at(-2);
									} else {
										newData['Page'] = cloneDeep(dataInitialValue['Page']);
									}
									return newData;
								})
								setFormSelected(prev => {
									const newData1 = cloneDeep(prev);
									newData1.prevFormTitle = '';
									if (newData1.nestedItemTraceObj['Page'].length > 1) {
										newData1.formTitle = 'Page';
										newData1.update = 'Page';
										if (!data['Page']._id) {
											newData1.editItemTraceObj['Page'] = (last(nestedItemTraceObj['Page']) as any)?._id;
										} else {
											newData1.editItemTraceObj['Page'] = (nestedItemTraceObj['Page'].at(-2) as any)?._id;
										}
										setData(prev => {
											const newData2 = cloneDeep(prev);
											newData2['Page'] = last(newData1.nestedItemTraceObj['Page']);
											return newData2;
										})
										if (data['Page']._id) {
											newData1.nestedItemTraceObj['Page'].pop();
										}
										return newData1;
									} else {
										setTopLevelModal(false);
										setData(cloneDeep(dataInitialValue));
										return cloneDeep(formSelectedInitObj);
									}
								})
							}}
							isDisabled={formSelected.loading}
						>
							Cancel
						</Button>
					</Flex>
				</form>
			</div>
		);
	} else {
		return <></>
	}
};

export default PageForm;
