import React, { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
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
import { OptionsType } from '../../models/model-types';

const FormFields = ({ fieldArr }: { fieldArr?: [string, any][] }) => {
	const [fields, setFields] = useState<[string, any][] | undefined>(fieldArr);
	const { data, setData, formSelected } = useManagePageForm();
	const { formTitle } = formSelected;
	useEffect(() => {
		setFields(fieldArr)
	}, [fieldArr])
	function resolveInput(title: string, obj: { options: OptionsType; instance: string; }) {
		const resolvedValue = get(data[formTitle], title, '');
		const resolveValue = (e: Event | ChangeEvent | FormEvent<HTMLInputElement>) => {
			setData(prev => {
				const newData = cloneDeep(prev);
				set(newData[formTitle], title, innerResolveValue((e.target as HTMLInputElement).value))
				return newData;
			})
			if (formTitle === 'Templates' && title === 'type') {
				// @ts-expect-error something something "needs a [Symbol.iterator]()" idk doesn't make sense
				setFields([...fields])
			}
			function innerResolveValue(val: string | undefined) {
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
					obj.options.enum && obj.options.enum.map(str => {
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
						disabled={data[formTitle][obj.options.dataFormKey ?? '']}
						onInput={async (e: FormEvent<HTMLInputElement>) => {
							await handleDataUpdate()
							async function handleDataUpdate() {
								const blobToData = (file: File) => {
									if (file.type.includes('video')) return '';
									return new Promise((resolve) => {
										const reader = new FileReader()
										reader.onloadend = () => resolve(reader.result);
										reader.readAsDataURL(file)
									})
								}
								if (!e?.currentTarget?.files) return;
								const dataUrl = await blobToData(e.currentTarget.files[0]);
								setData((prev) => {
									if (!e?.currentTarget?.files) return prev;
									const newData = cloneDeep(prev);
									newData[formTitle][obj.options.dataFormKey ?? ''] = e.currentTarget.files[0];
									newData[formTitle][obj.options.dataPreviewUrl ?? ''] = dataUrl;
									newData[formTitle][obj.options.previewTypeKey ?? ''] = e.currentTarget.files[0].type;
									return newData;
								})
							}
						}}
					/>
					{
						data[formTitle][obj.options.dataFormKey ?? ''] &&
							<Button
								onClick={() => {
									setData((prev) => {
										const newData = cloneDeep(prev);
										newData[formTitle][obj.options.dataFormKey ?? ''] = '';
										newData[formTitle][obj.options.dataPreviewUrl ?? ''] = '';
										newData[formTitle][obj.options.previewTypeKey ?? ''] = '';
										const el: HTMLInputElement | null = document.querySelector(`#${title}`);
										if (el) {
											el.value = '';
										}
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
							data[formTitle][obj.options.dataPreviewUrl ?? ''] &&
								<>
									<Text>Current Image</Text>
									<Image
										width='100'
										height='100'
										alt={data[formTitle]?.[title] ?? 'alt'}
										src={data[formTitle][obj.options.dataPreviewUrl ?? '']}
										onLoad={(e) => {
											setData(prev => {
												const newData = cloneDeep(prev);
												newData[formTitle][obj.options.dimensionsKey ?? ''] =
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
					const titleLevel1: string = sub[0];
					const obj: any = sub[1];
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
												const titleLevel2: string = sub[0];
												const obj: any = sub[1];
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