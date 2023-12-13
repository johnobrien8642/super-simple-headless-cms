import React, { SetStateAction, useState } from 'react';
import Image from 'next/image';
import {
	Text,
	IconButton,
	Center,
	Box,
	Flex,
	Modal,
	ModalHeader,
	ModalCloseButton,
	ModalOverlay,
	ModalContent,
	ModalBody,
	Button,
	Tooltip,
	Spinner
} from '@chakra-ui/react';
import { truncate } from 'lodash';
import { FormSelectedType, useManagePageForm } from '../contexts/useManagePageForm';
import { EditIcon, AddIcon, MinusIcon, RepeatIcon, DeleteIcon } from '@chakra-ui/icons';
import { remove, cloneDeep } from 'lodash';
import { useDrag, useDrop } from 'react-dnd';
// @ts-expect-error there's no types for lodash-move it's old af
import move from 'lodash-move';
import { AllDocType, AllDocArrayType } from './types/util_types';
import { OptionsType } from '../../models/model-types';

const ListFieldItem = ({
	item,
	type,
	chosen,
	title,
	index,
	noForm,
	setItems,
	setChosenItems,
	setAvailableItems,
	singleChoice
}: {
	item: AllDocType;
	type: string;
	chosen: string;
	title: string;
	singleChoice: boolean | undefined;
	index?: number;
	setItems?: React.Dispatch<SetStateAction<AllDocArrayType>>;
	setChosenItems?: React.Dispatch<SetStateAction<AllDocArrayType>>;
	setAvailableItems?: React.Dispatch<SetStateAction<AllDocArrayType>>;
	chosenItems?: AllDocArrayType;
	noForm?: boolean;
}) => {
	const { data, setData, formSelected, setFormSelected, setTopLevelModal } = useManagePageForm();
	const { formTitle } = formSelected;
	const [openModal, setOpenModal] = useState(false);
	const [error, setError] = useState('');
	const styleProps = {
		as: 'span',
		mx: '1rem',
		textAlign: 'center',
		fontSize: '.9rem'
	}
	const [{ isOver }, drop] = useDrop(() => ({
		accept: 'ListFieldItem',
		drop: (item: { index: number; } & AllDocType) => {
			if (noForm) {
				if (setItems) {
					setItems(prev => {
						const newData = cloneDeep(prev);
						return move(newData, item.index, index);
					})
				}
			} else {
				if (setChosenItems) {
					setChosenItems(prev => {
						let newData = cloneDeep(prev);
						newData = move(newData, item.index, index);
						return newData;
					})
				}
				setData(prev => {
					const newData = cloneDeep(prev);
					newData[formTitle][title] = move(newData[formTitle][title], item.index, index);
					return newData;
				})
			}
		},
		collect: (monitor) => ({
			isOver: monitor.isOver()
		})
	}))
	// @ts-expect-error object is throwing error, typing not needed
	const [{}, drag] = useDrag(() => ({
		type: 'ListFieldItem',
		item: {
			...item,
			index
		}
	}), [])

	function handleListFieldItemContent() {
		return (
			<>
				<Text sx={{...styleProps}}>{(item as any)?.folderHref}</Text>
				<Text sx={{...styleProps}}>{truncate((item as any)?.title ?? '', { length: 50 })}</Text>
				<Tooltip
					label={(item as any)?.description}
					openDelay={500}
				>
					<Text sx={{...styleProps}}>{truncate((item as any)?.description ?? '', { length: 20 })}</Text>
				</Tooltip>
				<Tooltip
					label={(item as any)?.richDescription}
					openDelay={500}
				>
					<Text
						whiteSpace='nowrap'
						overflow='hidden'
						textOverflow='ellipsis'
						maxWidth='10rem'
						display='block'
						sx={{
							...styleProps,
							'p': {
								marginBottom: '0'
							}
						}}
						dangerouslySetInnerHTML={{ __html: (item as any)?.richDescription ?? '' }}
					/>
				</Tooltip>
				<Text sx={{...styleProps}}>{(item as any)?.type}</Text>
				{
					(item as any)?.assetKey && (item as any)?.type === 'Image' &&
						<Box
							mx='1rem'
							width='100'
							height='100%'
						>
							<Image
								width='100'
								height='100'
								alt={item?.title ?? 'alt'}
								src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + (item as any).assetKey}
							/>
						</Box>
				}
				{
					(item as any)?.thumbnailKey &&
						<Box
							mx='1rem'
							width='100'
							height='100%'
						>
							<Image
								width='100'
								height='100'
								alt={item?.title ?? 'alt'}
								src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + (item as any).thumbnailKey}
							/>
						</Box>
				}
			</>
		)
	}

	return (
		<>
			<Box
				key={item._id.toString()}
				ref={drop}
			>
				<Flex
					justifyContent='space-between'
					border='black solid .1rem'
					borderRadius='.5rem'
					m='1rem'
					alignItems='center'
					padding='.5rem'
					ref={drag}
				>
					{handleListFieldItemContent()}
					<Flex>
						{
							chosen && chosen === 'true' &&
								<IconButton
									onClick={() => {
										if (setAvailableItems) {
											setAvailableItems(prev => {
												const newData = cloneDeep(prev);
												newData.push((item as any));
												return newData;
											})
										}
										if (setChosenItems) {
											setChosenItems(prev => {
												let newData = cloneDeep(prev);
												if (singleChoice) {
													newData = [item] as AllDocArrayType;
												} else {
													//@ts-expect-error
													remove(newData, (arrItem) => {
														return arrItem._id === item._id
													});
												}
												return newData;
											})
										}
										setData(prev => {
											const newData = cloneDeep(prev);
											if (singleChoice) {
												newData[formTitle][title] = [];
											} else {
												remove(newData[formTitle]?.[title], (id) => {
													return id === item._id
												});
											}
											return newData;
										})
									}}
									icon={<MinusIcon />}
									mr='.3rem'
									aria-label='Minus Button'
								/>
						}
						{
							chosen && chosen === 'false' &&
								<IconButton
									onClick={() => {
										if (setChosenItems) {
											setChosenItems(prev => {
												const newData = cloneDeep(prev);
												newData.push((item as any));
												return newData;
											})
										}
										if (setAvailableItems) {
											setAvailableItems(prev => {
												let newData = cloneDeep(prev);
												//@ts-expect-error
												remove(newData, (arrItem) => {
													return arrItem._id === item._id
												});
												return newData;
											})
										}
										setData(prev => {
											const newData = cloneDeep(prev);
											if (singleChoice) {
												newData[formTitle][title] = [item._id];
											} else {
												newData[formTitle]?.[title].push(item._id);
											}
											return newData;
										})
									}}
									icon={<AddIcon />}
									mr='.3rem'
									aria-label='Add Button'
								/>
						}
						<IconButton
							onClick={() => {
								setData(prev => {
									const newData = cloneDeep(prev);
									newData[item.schemaName ?? ''] = item;
									return newData;
								})
								setFormSelected(prev => {
									const newData: FormSelectedType = { ...prev };
									newData.formTitle = item.schemaName ?? '';
									newData.update = item.schemaName ?? '';
									newData.editItemTraceObj[item.schemaName ?? ''] = item._id;
									return newData;
								})
								if (item.schemaName === 'Page') {
									setTopLevelModal(true)
								}
							}}
							icon={<EditIcon />}
							mr='.3rem'
							aria-label='Edit Button'
						/>
						{formTitle !== 'Page' && <IconButton
							onClick={async () => {
								let itemRef = { ...item };
								// @ts-expect-error but I do want to delete a non-optional param tho
								delete itemRef._id;
								const res3 = await fetch('/api/handle_duplicate_item',
								{
									method: 'POST',
									headers: {
										Accept: 'application/json',
										'Content-Type': 'application/json'
									},
									body: JSON.stringify({
										item: itemRef,
										schema: item.schemaName
									})
								})
								const data2 = await res3.json();
								const { savedNewItem } = data2;
								if (chosen === 'true') {
									setData(prev => {
										const newData = cloneDeep(prev);
										newData[formTitle][title] = [...data[formTitle][title], savedNewItem._id];
										return newData;
									})
								} else {
									if (setAvailableItems && index) {
										setAvailableItems(prev => {
											const newData = cloneDeep(prev);
											newData.splice(index, 0, savedNewItem);
											return newData;
										})
									}
								}
							}}
							icon={<RepeatIcon />}
							mr='.3rem'
							aria-label='Duplicate Button'
						/>}
						{<IconButton
							onClick={() => {
								setOpenModal(true)
							}}
							icon={<DeleteIcon />}
							aria-label='Delete Button'
						/>}
					</Flex>
					<Modal
						isOpen={openModal}
						onClose={() => {
							setOpenModal(false);
						}}
					>
						<ModalOverlay />
						<ModalContent position='relative' maxW='800px'>
							<ModalHeader>Delete {item.schemaName}</ModalHeader>
							<ModalCloseButton />
							<ModalBody>
								<Flex
									flexDir='column'
									my='1rem'
								>
									<Flex
										mx='auto'
										my='1rem'
									>
										{handleListFieldItemContent()}
									</Flex>
									{formSelected.loading && <Spinner size='xl' />}
									{
										error &&
											<Text
												color='red'
												my='1rem'
											>

												{`Something went wrong: ${error}`}
											</Text>
									}
									<Center>
										<Button
											colorScheme='blue'
											mr={3}
											isDisabled={formSelected.loading}
											onClick={async () => {
												setFormSelected(prev => {
													const newData = cloneDeep(prev);
													newData.loading = true;
													return newData;
												});
												const res = await fetch(`/api/get_model_schema?formTitle=${item.schemaName}`);
												const data = await res.json();
												const { schemaPaths } = data;
												const entries = Object.entries(schemaPaths);
												let entryTitle: string;
												let obj: { options: OptionsType; };
												let keysToDelete = {};
												for (let i = 0; i < entries.length; i++) {
													entryTitle = entries[i][0];
													obj = entries[i][1] as { options: OptionsType; };
													if (obj.options.file) {
														if ((item as any)[entryTitle]) {
															(keysToDelete as any)[entryTitle] = (item as any)[entryTitle]
														}
													}
												}
												const res3 = await fetch(`/api/handle_delete_item`, {
													method: 'DELETE',
													headers: {
														Accept: 'application/json',
														'Content-Type': 'application/json'
													},
													body: JSON.stringify({
														item,
														formTitle,
														title,
														keysToDelete
													})
												});
												if (res3.ok) {
													setFormSelected(prev => {
														const newData = cloneDeep(prev);
														newData.loading = false;
														return newData;
													});
													setData(prev => {
														const newData = cloneDeep(prev);
															if (newData[formTitle]?.[title]) {
																newData[formTitle][title] =
																	newData[formTitle][title]
																.filter((str: string) => str !== item._id.toString());
															}
														return newData;
													})
													if (noForm) {
														if (setItems) {
															setItems(prev => {
																const newData = cloneDeep(prev);
																if (newData.length === 1) return [] as AllDocArrayType;
																return newData.filter(obj => obj._id.toString() !== item._id.toString()) as AllDocArrayType;
															})
														}
													} else {
														if (setChosenItems) {
															setChosenItems(prev => {
																let newData = cloneDeep(prev);
																//@ts-expect-error
																remove(newData, (arrItem) => {
																	return arrItem._id === item._id
																});
																return newData;
															})
														}
														if (setAvailableItems) {
															setAvailableItems(prev => {
																const newData = cloneDeep(prev);
																if (newData.length === 1) return [] as AllDocArrayType;
																return newData.filter(obj => obj._id !== item._id)  as AllDocArrayType;
															})
														}
													}
													setOpenModal(false)
												} else {
													const data3 = await res3.json();
													setFormSelected(prev => {
														const newData = cloneDeep(prev);
														newData.loading = false;
														return newData;
													});
													setError(data3.errorMessage);
												}
											}}
										>
											Confirm Delete
										</Button>
										<Button
											colorScheme='blue'
											mr={3}
											onClick={() => {
												setOpenModal(false);
											}}
											isDisabled={formSelected.loading}
										>
											Cancel
										</Button>
									</Center>
								</Flex>
							</ModalBody>
						</ModalContent>
					</Modal>
				</Flex>
			</Box>
			{isOver && <Box backgroundColor='var(--chakra-colors-blue-100)' height='3px'></Box>}
		</>
	)
}

export default ListFieldItem;