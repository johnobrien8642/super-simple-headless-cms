import React, { useState } from 'react';
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
	ModalFooter,
	Button,
	Tooltip,
	Skeleton,
	Spinner
} from '@chakra-ui/react';
import { truncate } from 'lodash';
import { useManagePageForm } from '../contexts/useManagePageForm';
import { EditIcon, AddIcon, MinusIcon, RepeatIcon, DeleteIcon } from '@chakra-ui/icons';
import { remove, cloneDeep } from 'lodash';
import { useDrag, useDrop } from 'react-dnd';
import move from 'lodash-move';

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
		drop: (item) => {
			if (noForm) {
				setItems(prev => {
					const newData = cloneDeep(prev);
					return move(newData, item.index, index);
				})
			} else {
				setChosenItems(prev => {
					let newData = cloneDeep(prev);
					newData = move(newData, item.index, index);
					return newData;
				})
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
	const [{}, drag] = useDrag(() => ({
		type: 'ListFieldItem',
		item: {
			...item,
			index
		},
	}), [])

	function handleListFieldItemContent() {
		return (
			<>
				<Text {...styleProps}>{item?.folderHref}</Text>
				<Text {...styleProps}>{truncate(item?.title, { length: 50 })}</Text>
				<Tooltip
					label={item?.description}
					openDelay={500}
				>
					<Text {...styleProps}>{truncate(item?.description, { length: 20 })}</Text>
				</Tooltip>
				<Tooltip
					label={item?.richDescription}
					openDelay={500}
				>
					<Text
						{...styleProps}
						whiteSpace='nowrap'
						overflow='hidden'
						textOverflow='ellipsis'
						maxWidth='10rem'
						display='block'
						sx={{
							'p': {
								marginBottom: '0'
							}
						}}
						dangerouslySetInnerHTML={{ __html: item?.richDescription }}
					/>
				</Tooltip>
				<Text {...styleProps}>{item?.type}</Text>
				{
					item?.assetKey && item?.type === 'Image' &&
						<Box
							mx='1rem'
							width='100'
							height='100%'
						>
							<Image
								width='100'
								height='100'
								alt={item?.title ?? 'alt'}
								src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + item.assetKey}
							/>
						</Box>
				}
				{
					item?.thumbnailKey &&
						<Box
							mx='1rem'
							width='100'
							height='100%'
						>
							<Image
								width='100'
								height='100'
								alt={item?.title ?? 'alt'}
								src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + item.thumbnailKey}
							/>

						</Box>
				}
			</>
		)
	}

	return (
		<>
			<Box
				key={item._id}
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
										setAvailableItems(prev => {
											const newData = cloneDeep(prev);
											newData.push(item);
											return newData;
										})
										setChosenItems(prev => {
											let newData = cloneDeep(prev);
											if (singleChoice) {
												newData = [item];
											} else {
												remove(newData, (arrItem) => {
													return arrItem._id === item._id
												});
											}
											return newData;
										})
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
								/>
						}
						{
							chosen && chosen === 'false' &&
								<IconButton
									onClick={() => {
										setChosenItems(prev => {
											const newData = cloneDeep(prev);
											newData.push(item);
											return newData;
										})
										setAvailableItems(prev => {
											let newData = cloneDeep(prev);
											remove(newData, (arrItem) => {
												return arrItem._id === item._id
											});
											return newData;
										})
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
								/>
						}
						<IconButton
							onClick={() => {
								setData(prev => {
									const newData = cloneDeep(prev);
									newData[item.schemaName] = item;
									return newData;
								})
								setFormSelected(prev => {
									const newData = { ...prev };
									newData.formTitle = item.schemaName;
									newData.update = item.schemaName;
									newData.editItemTraceObj[item.schemaName] = item._id;
									return newData;
								})
								if (item.schemaName === 'Page') {
									setTopLevelModal(true)
								}
							}}
							icon={<EditIcon />}
							mr='.3rem'
						/>
						{formTitle !== 'Page' && <IconButton
							onClick={async () => {
								let itemRef = { ...item };
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
									setAvailableItems(prev => {
										const newData = cloneDeep(prev);
										newData.splice(index, 0, savedNewItem);
										return newData;
									})
								}
							}}
							icon={<RepeatIcon />}
							mr='.3rem'
						/>}
						{<IconButton
							onClick={() => {
								setOpenModal(true)
							}}
							icon={<DeleteIcon />}
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
												let entryTitle;
												let obj;
												let keysToDelete = {};
												for (let i = 0; i < entries.length; i++) {
													entryTitle = entries[i][0];
													obj = entries[i][1];
													if (obj.options.file) {
														if (item[entryTitle]) {
															keysToDelete[entryTitle] = item[entryTitle]
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
																.filter(str => str !== item._id);
															}
														return newData;
													})
													if (noForm) {
														setItems(prev => {
															const newData = cloneDeep(prev);
															if (newData.length === 1) return [];
															return newData.filter(obj => obj._id !== item._id);
														})
													} else {
														setChosenItems(prev => {
															let newData = cloneDeep(prev);
															remove(newData, (arrItem) => {
																return arrItem._id === item._id
															});
															return newData;
														})
														setAvailableItems(prev => {
															const newData = cloneDeep(prev);
															if (newData.length === 1) return [];
															return newData.filter(obj => obj._id !== item._id);
														})
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