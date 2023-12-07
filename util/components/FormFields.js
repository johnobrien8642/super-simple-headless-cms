import React, { useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
	Input,
	Box,
	Text,
	Textarea,
	Select,
	FormControl,
	FormLabel,
	Switch,
	Button,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
	Skeleton
} from '@chakra-ui/react'
import { capitalize } from 'lodash';
import ListField from './ListField';
const Editor = dynamic(() => import('./Editor'), { ssr: false });
import { useManagePageForm } from '../contexts/useManagePageForm';
import { templateOptions, assetTypes, textAlignOptions } from '../../template_options';
import { cloneDeep, get, set, startCase } from 'lodash';

const FormFields = ({ fieldArr, dataKey }) => {
	const [fields, setFields] = useState(fieldArr);
	const { data, setData, formSelected } = useManagePageForm();
	const { formTitle } = formSelected;
	useEffect(() => {
		setFields(fieldArr)
	}, [fieldArr])
	function resolveInput(title, obj) {
		const resolvedValue = get(data[formTitle], title, '');
		const resolveValue = (e) => {
			setData(prev => {
				const newData = cloneDeep(prev);
				set(newData[formTitle], title, innerResolveValue(e.target.value))
				return newData;
			})
			if (formTitle === 'Templates' && title === 'type') {
				setFields([...fields])
			}
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
				value={resolvedValue}
			>
				{
					obj.options.enum.map(str => {
						return <option key={str} value={str}>{startCase(str)}</option>
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
									<>
										<Text>Current Image</Text>
										<Image
											width='100'
											height='100'
											alt={data[formTitle]?.[title] ?? 'alt'}
											src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + data[formTitle][title]}
										/>
									</>
					}
					{
						data[formTitle].type === 'Image' &&
							data[formTitle][obj.options.dataPreviewUrl] &&
								<>
									<Text>Current Image</Text>
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
								</>
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
		<Box
			sx={{
				'.ck-content': {
					minHeight: '220px'
				}
			}}
		>
			{
				fields?.map(sub => {
					const titleLevel1 = sub[0];
					const obj = sub[1];
					const inUse = obj.options?.templates?.[data['Templates'].type];
					if (obj.options.collapseTitle) {
						return <Skeleton isLoaded={!formSelected.loading} key={titleLevel1 + obj.options}>
							<Accordion allowToggle mb='1rem'>
								<AccordionItem>
									<AccordionButton
										backgroundColor={inUse && formTitle !== 'Page' ? 'var(--chakra-colors-blue-100)' : ''}
									>
										{obj.options.collapseTitle}
									<AccordionIcon />
									</AccordionButton>
									<AccordionPanel>
										{
											Object.entries(obj.options.type.paths).map(sub => {
												const titleLevel2 = sub[0];
												const obj = sub[1];
												if (!obj.options.hide && !titleLevel2.match('_id') && !titleLevel2.match('__v')) {
													return <FormControl my='1rem' height='fit-content' key={titleLevel2} isRequired={obj.isRequired}>
														<FormLabel htmlFor={titleLevel2}>{capitalize(obj.options.formTitle ?? titleLevel2)}</FormLabel>
														{resolveInput(`${titleLevel1}.${titleLevel2}`, obj)}
													</FormControl>
												}
											})
										}
									</AccordionPanel>
								</AccordionItem>
							</Accordion>
						</Skeleton>
					} else if (!obj.options.hide && !titleLevel1.match('_id') && !titleLevel1.match('__v')) {
						return <FormControl my='1rem' key={titleLevel1} isRequired={obj.isRequired}>
							<FormLabel
								htmlFor={titleLevel1}
								backgroundColor={inUse ? 'var(--chakra-colors-blue-100)' : ''}
							>
								{capitalize(obj.options.formTitle ?? titleLevel1)}
							</FormLabel>
							<Skeleton isLoaded={!formSelected.loading}>
								{resolveInput(titleLevel1, obj)}
							</Skeleton>
						</FormControl>
					}
				})
			}
		</Box>
	)
}

export default FormFields;