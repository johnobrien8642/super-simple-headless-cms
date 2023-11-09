import React from 'react';
import { Input, Box, Text, Textarea, Select } from '@chakra-ui/react'
import { capitalize } from 'lodash';
import ListField from './ListField';
import { useManagePageForm } from '../contexts/useManagePageForm';
import { templateOptions } from '../../template_options';

const FormFields = ({ fieldArr, nestedKey }) => {
	const { pageFormData, setPageFormData } = useManagePageForm();
	console.log(pageFormData)
	function resolveInput(title, obj, index) {
		if (obj.instance === 'Array') {
			return <ListField obj={obj} index={index} nestedKey={nestedKey} />
		} else if (obj.instance === 'String' && obj.options.textbox) {
			return <Textarea
				value={pageFormData[title] || ''}
				size='lg'
				onChange={((e) => {
					setPageFormData(prev => {
						return {
							...prev,
							[title]: e.target.value
						}
						// const newData = {
						// 	...prev
						// }
						// if (nestedKey) {
						// 	newData[nestedKey][index][title] = e.target.value
						// 	return newData
						// } else {
						// }
					})
				})}
			/>
		} else if (obj.instance === 'String' && obj.options.select) {
			return <Select
				onChange={e => {
					setPageFormData(prev => {
						return {
							...prev,
							[title]: e.target.value
						}
					})
				}}
				placeholder='Select One'
				defaultValue=''
			>
				{
					templateOptions.map(str => {
						return <option key={str} value={str}>{str}</option>
					})
				}
			</Select>
		} else {
			return <Input
				value={pageFormData[title] || ''}
				type={obj.options.file ? 'file' : obj.instance.toLowerCase()}
				onInput={((e) => {
					setPageFormData(prev => {
						return {
							...prev,
							[title]: e.target.value
						}
						// const newData = {
						// 	...prev
						// }
						// if (nestedKey) {
						// 	newData[nestedKey][index][title] = e.target.value
						// 	return newData
						// } else {
						// }
					})
				})}
			/>
		}
	}

	return (
		<>
			{
				fieldArr?.map((sub, index) => {
					const title = sub[0];
					const obj = sub[1];
					if (!obj.options.hide && !title.match('_id') && !title.match('__v')) {
						return <Box key={title}>
							<Text my='1rem'>{capitalize(obj.options.formTitle ?? title)}</Text>
							{resolveInput(title, obj, index)}
						</Box>
					}
				})
			}
		</>
	)
}

export default FormFields;