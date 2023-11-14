import React, { useEffect, useState } from 'react'
import connectDb from '../../lib/mongodb';
import Link from 'next/link';
import Admin from '../../models/Admin';
import jwt from 'jsonwebtoken';
import {
	Button,
	Modal,
	ModalHeader,
	ModalCloseButton,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalFooter,
	Spinner,
	Flex,
	Box
} from '@chakra-ui/react'
import AdminHeader from '../components/AdminHeader';
import PageForm from '../components/PageForm';
import TemplateForm from '../components/TemplateForm';
import AssetForm from '../components/AssetForm';
import { ManagePageFormProvider, dataInitialValue } from '../contexts/useManagePageForm.tsx';
import ListField from '../components/ListField';
import ListFieldItem from '../components/ListFieldItem';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { cloneDeep } from 'lodash';


const ManagePages = ({ admin }) => {
	const [topLevelModal, setTopLevelModal] = useState(false);
	const [formSelected, setFormSelected] = useState({ formTitle: 'Page', formIndex: 0, editItemTraceObj: { 'Page': '', 'Templates': '', 'Assets': '' }, update: false });
	const [data, setData] = useState(dataInitialValue);
	const [items, setItems] = useState(null);

	useEffect(() => {
		if (!admin) {
			router.push('/admin');
		}
	}, []);

	useEffect(() => {
		handleGetList();
		async function handleGetList() {
			const res = await fetch('/api/get_list_field_items',
			{
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					schema: 'Page'
				})
			})
			const data = await res.json();
			const { availableItems } = data;
			setItems(availableItems);
		}
	}, [data])

	return (
		<ManagePageFormProvider
			data={data}
			setData={setData}
			formSelected={formSelected}
			setFormSelected={setFormSelected}
			setTopLevelModal={setTopLevelModal}
			topLevelModal={topLevelModal}
		>
			<AdminHeader />
			<Button
				onClick={() => {
					setTopLevelModal(true);
					setData(dataInitialValue);
					setFormSelected(prev => {
						return {
							...prev,
							formTitle: 'Page',
							prevFormTitle: '',
							editItemTraceObj: { 'Page': '', 'Templates': '', 'Assets': ''},
							update: ''
						}
					});
				}}
			>
				Create New Page
			</Button>
			<Flex>
				{
					items?.map(obj => {
						return <ListFieldItem key={obj._id} item={obj} type='Page' />
					})
				}
			</Flex>
			<Modal
				isOpen={topLevelModal}
				onClose={() => {
					setTopLevelModal(false);
					setData(dataInitialValue);
					setFormSelected(prev => {
						return {
							...prev,
							formTitle: 'Page',
							prevFormTitle: '',
							editItemTraceObj: { 'Page': '', 'Templates': '', 'Assets': ''},
							update: ''
						}
					});
				}}
			>
				<ModalOverlay />
				<ModalContent maxW='800px' position='relative'>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<DndProvider backend={HTML5Backend}>
							<PageForm />
							<TemplateForm />
							<AssetForm />
						</DndProvider>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme='blue'
							mr={3}
							onClick={() => {
								setTopLevelModal(false);
								setData(dataInitialValue);
								setFormSelected(prev => {
									return {
										...prev,
										formTitle: 'Page',
										prevFormTitle: '',
										editItemTraceObj: { 'Page': '', 'Templates': '', 'Assets': ''},
										update: ''
									}
								});
							}}
						>
							Close New Page Form
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</ManagePageFormProvider>
	)
}

export async function getServerSideProps(context) {
	await connectDb();
	let decoded;
	if (context.req.cookies.token) {
		decoded = jwt.verify(context.req.cookies.token, process.env.NEXT_PUBLIC_SECRET_KEY);
	}
	const authenticated = await Admin.findById(decoded?.id);

	return {
		props: {
			admin: !!authenticated
		}
	};
}

export default ManagePages;
