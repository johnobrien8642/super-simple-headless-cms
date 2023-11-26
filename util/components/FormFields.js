import React, { useMemo } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import { Input, Box, Text, Textarea, Select, FormControl, FormLabel, Switch, Button } from '@chakra-ui/react'
import { capitalize } from 'lodash';
import ListField from './ListField';
const Editor = dynamic(() => import('./Editor'), { ssr: false });
import { useManagePageForm } from '../contexts/useManagePageForm';
import { templateOptions, assetTypes, textAlignOptions } from '../../template_options';
import { cloneDeep } from 'lodash';

const FormFields = ({ fieldArr, dataKey }) => {
	const { data, setData, formSelected } = useManagePageForm();
	const { formTitle } = formSelected;
	function resolveInput(title, obj, index) {
		const resolvedValue = data[formTitle]?.[title] || '';
		const resolveValue = (e) => {
			setData(prev => {
				const newData = cloneDeep(prev);
				newData[formTitle][title] = innerResolveValue(e.target.value);
				return newData;
			})
			function innerResolveValue(val) {
				if (val === 'true') return false;
				if (val === 'false') return true;
				return val;
			}
		}
		if (obj.instance === 'Array') {
			return <ListField
				title={title}
				obj={obj}
				singleChoice={obj.options?.singleChoice}
				formTitleProp={formTitle}
			/>
		} else if (obj.instance === 'String' && obj.options.textbox) {
			return <Textarea
				value={resolvedValue}
				size='lg'
				onChange={e => resolveValue(e)}
			/>
		} else if (obj.instance === 'String' && obj.options.richText) {
				return <Editor
					data={data[formTitle][title]}
					setData={setData}
					formTitle={formTitle}
					title={title}
				/>
		} else if (obj.instance === 'String' && obj.options.select) {
			const options = {
				templateOptions,
				assetTypes,
				textAlignOptions
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
		} else if (obj.instance === 'Boolean') {
			return <Switch
				id={title}
				isChecked={data[formTitle][title]}
				value={data[formTitle][title]}
				onChange={e => resolveValue(e)}
				size='lg'
			/>
		} else {
			if (obj.options.file) {
				return <Box>
					<Input
						id={title}
						value={undefined}
						accept='*'
						type='file'
						disabled={data[formTitle][obj.options.dataFormKey]}
						onInput={async (e) => {
							await handleDataUpdate()
							async function handleDataUpdate() {
								const blobToData = (file) => {
									if (file.type.includes('video')) return '';
									return new Promise((resolve) => {
										const reader = new FileReader()
										reader.onloadend = () => resolve(reader.result);
										reader.readAsDataURL(file)
									})
								}
								const dataUrl = await blobToData(e.target.files[0]);
								setData((prev) => {
									const newData = cloneDeep(prev);
									newData[formTitle][obj.options.dataFormKey] = e.target.files[0];
									newData[formTitle][obj.options.dataPreviewUrl] = dataUrl;
									newData[formTitle][obj.options.previewTypeKey] = e.target.files[0].type;
									return newData;
								})
							}
						}}
					/>
					{
						data[formTitle][obj.options.dataFormKey] &&
							<Button
								onClick={() => {
									setData((prev) => {
										const newData = cloneDeep(prev);
										newData[formTitle][obj.options.dataFormKey] = '';
										newData[formTitle][obj.options.dataPreviewUrl] = '';
										newData[formTitle][obj.options.previewTypeKey] = '';
										const el = document.querySelector(`#${title}`);
										el.value = '';
										return newData;
									})
								}}
							>
								Clear
							</Button>
					}
					{
						data[formTitle][title] &&
							data[formTitle].type === 'Image' &&
								formSelected.update &&
									<Image
										width='100'
										height='100'
										alt={data[formTitle]?.[title] ?? 'alt'}
										src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + data[formTitle][title]}
									/>
					}
					{
						data[formTitle][obj.options.dataPreviewUrl] &&
							<Image
								width='100'
								height='100'
								alt={data[formTitle]?.[title] ?? 'alt'}
								src={data[formTitle][obj.options.dataPreviewUrl]}
								onLoad={(e) => {
									setData(prev => {
										const newData = cloneDeep(prev);
										newData[formTitle][obj.options.dimensionsKey] =
											[e.currentTarget.naturalWidth, e.currentTarget.naturalHeight];
										return newData;
									})
								}}
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
						return <FormControl my='1rem' key={title} isRequired={obj.isRequired}>
							<FormLabel htmlFor={title}>{capitalize(obj.options.formTitle ?? title)}</FormLabel>
							{resolveInput(title, obj, index)}
						</FormControl>
					}
				})
			}
		</>
	)
}

export default FormFields;