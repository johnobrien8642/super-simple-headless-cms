import React from 'react';
import Image from 'next/image';
import { Input, Box, Text, Textarea, Select, FormControl, FormLabel } from '@chakra-ui/react'
import { capitalize } from 'lodash';
import ListField from './ListField';
import { useManagePageForm } from '../contexts/useManagePageForm';
import { templateOptions, assetTypes } from '../../template_options';
import { cloneDeep } from 'lodash';

const FormFields = ({ fieldArr, dataKey }) => {
	const { data, setData, formSelected } = useManagePageForm();
	const { formTitle } = formSelected;
	function resolveInput(title, obj, index) {
		const resolvedValue = data[formTitle]?.[title] || '';
		const resolveValue = (e) => {
			setData(prev => {
				const newData = cloneDeep(prev);
				newData[formTitle][title] = e.target.value;
				return newData;
			})
		}
		if (obj.instance === 'Array') {
			return <ListField title={title} obj={obj} />
		} else if (obj.instance === 'String' && obj.options.textbox) {
			return <Textarea
				value={resolvedValue}
				size='lg'
				onChange={e => resolveValue(e)}
			/>
		} else if (obj.instance === 'String' && obj.options.select) {
			const options = {
				templateOptions,
				assetTypes
			}
			return <Select
				onChange={e => resolveValue(e)}
				placeholder='Select One'
				defaultValue={resolvedValue}
			>
				{
					options[obj.options.enumKey].map(str => {
						return <option key={str} value={str}>{str}</option>
					})
				}
			</Select>
		} else {
			if (obj.options.file) {
				return <Box>
					<Input
						value={undefined}
						accept='*'
						type='file'
						onInput={e => {
							setData(prev => {
								const newData = cloneDeep(prev);
								newData[formTitle][obj.options.dataFormKey] = e.target.files[0];
								return newData;
							})
						}}
					/>
					{
						data[formTitle][title] && data[formTitle].type === 'Image' &&
							<Image
								width='100'
								height='100'
								alt={data[formTitle]?.[title] ?? 'alt'}
								src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + data[formTitle][title]}
							/>
					}
				</Box>
			} else {
				return <Input
					value={resolvedValue}
					type={obj.instance.toLowerCase()}
					onInput={e => resolveValue(e)}
				/>
			}
		}
	}

	return (
		<>
			{
				fieldArr?.map((sub, index) => {
					const title = sub[0];
					const obj = sub[1];
					if (!obj.options.hide && !title.match('_id') && !title.match('__v')) {
						return <FormControl key={title} isRequired={obj.isRequired}>
							<FormLabel>{capitalize(obj.options.formTitle ?? title)}</FormLabel>
							{resolveInput(title, obj, index)}
						</FormControl>
					}
				})
			}
		</>
	)
}

export default FormFields;