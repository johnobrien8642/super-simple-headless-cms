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
	Button
} from '@chakra-ui/react';
import { truncate } from 'lodash';
import { useManagePageForm } from '../contexts/useManagePageForm';
import { CloseIcon, EditIcon, AddIcon, MinusIcon } from '@chakra-ui/icons';
import { remove, cloneDeep } from 'lodash';

const ListFieldItem = ({ item, type, chosen, title }) => {
	const { data, setData, formSelected, setFormSelected, setTopLevelModal } = useManagePageForm();
	const { formTitle } = formSelected;
	const [openModal, setOpenModal] = useState(false);
	const styleProps = {
		as: 'span',
		mx: '1rem',
		textAlign: 'center'
	}
	return (
		<Flex
			key={item._id}
			justifyContent='space-between'
			border='black solid .1rem'
			borderRadius='.5rem'
			m='1rem'
			alignItems='center'
			padding='.5rem'
		>
			{
				item?.title && <Text {...styleProps}>{item.title}</Text>
			}
			{
				item?.description && <Text {...styleProps}>{truncate(item.description, { length: 100 })}</Text>
			}
			{
				item?.templateType && <Text {...styleProps}>{item.templateType}</Text>
			}
			{
				item?.assetKey && <Image width='100' height='100' alt={item?.title ?? 'alt'} src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + item.assetKey} />
			}
			{
				item?.thumbnailKey && <Image width='100' height='100' alt={item?.title ?? 'alt'} src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + item.thumbnailKey} />
			}
			{
				<Box>
					{
						chosen && chosen === 'true' &&
							<IconButton
								onClick={() => {
									setData(prev => {
										const newData = cloneDeep(prev);
										remove(newData[formTitle]?.[title], (id) => {
											return id === item._id
										});
										return newData;
									})
								}}
								icon={<MinusIcon />}
								mx='.3rem'
							/>
					}
					{
						chosen && chosen === 'false' &&
							<IconButton
								onClick={() => {
									setData(prev => {
										const newData = cloneDeep(prev);
										newData[formTitle]?.[title].push(item._id);
										return newData;
									})
								}}
								icon={<AddIcon />}
								mx='.3rem'
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
								newData.editItemTraceObj[formTitle] = item._id;
								return newData;
							})
							if (item.schemaName === 'Page') {
								setTopLevelModal(true)
							}
						}}
						icon={<EditIcon />}
						mx='.3rem'
					/>
					{<IconButton
						onClick={() => {
							setOpenModal(true)
						}}
						icon={<CloseIcon />}
					/>}
				</Box>
			}
			<Modal
				isOpen={openModal}
				onClose={() => {
					setOpenModal(false);
				}}
			>
				<ModalOverlay />
				<ModalContent position='relative'>
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
								{
									item?.title && <Text {...styleProps}>{item.title}</Text>
								}
								{
									item?.description && <Text {...styleProps}>{truncate(item.description, { length: 100 })}</Text>
								}
								{
									item?.templateType && <Text {...styleProps}>{item.templateType}</Text>
								}
								{
									item?.assetLink && <Image width='100' height='100' alt={item?.title ?? 'alt'} src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + item.assetLink} />
								}
								{
									item?.thumbnailLink && <Image width='100' height='100' alt={item?.title ?? 'alt'} src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + item.thumbnailLink} />
								}
							</Flex>
							<Center>
								<Button
									colorScheme='blue'
									mr={3}
									onClick={async () => {
										const res = await fetch('/api/get_model_schema',
										{
											method: 'POST',
											headers: {
												Accept: 'application/json',
												'Content-Type': 'application/json'
											},
											body: JSON.stringify({
												schema: item.schemaName
											})
										})
										const data = await res.json();
										const { schemaPaths } = data;
										const entries = Object.entries(schemaPaths);
										let title;
										let obj;
										let keysToDelete = [];
										for (let i = 0; i < entries.length; i++) {
											title = entries[i][0];
											obj = entries[i][1];
											if (obj.options.file) {
												if (item[title]) {
													keysToDelete.push(item[title])
												}
											}
										}
										const res2 = await fetch(`/api/handle_s3_url`, {
											method: 'DELETE',
											headers: {
												Accept: 'application/json',
												'Content-Type': 'application/json'
											},
											body: JSON.stringify({
												keysToDelete
											})
										});
										if (!res2.ok) {
											const data = await res2.json()
											console.log(data)
											console.log('S3 Delete Failed, object keys:', keysToDelete)
										}
										const res3 = await fetch(`/api/handle_delete_item`, {
											method: 'DELETE',
											headers: {
												Accept: 'application/json',
												'Content-Type': 'application/json'
											},
											body: JSON.stringify({
												item
											})
										});
										setData(prev => {
											const newData = cloneDeep(prev);
											newData[formTitle][item.schemaName.toLowerCase()] =
												newData[formTitle][item.schemaName.toLowerCase()]
													.filter(str => str !== item._id);
											return newData;
										})
										setOpenModal(false)
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
								>
									Cancel
								</Button>
							</Center>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</Flex>
	)
}

export default ListFieldItem;