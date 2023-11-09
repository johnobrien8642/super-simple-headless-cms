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
import { ManagePageFormProvider } from '../contexts/useManagePageForm.tsx';
import ListField from '../components/ListField';
import ListFieldItem from '../components/ListFieldItem';


const ManagePages = ({ admin }) => {
	const [openModal, setOpenModal] = useState();
	const [formSelected, setFormSelected] = useState({ formFlow: ['Page', 'Templates', 'Assets'], formIndex: 0 });
	const [pageFormData, setPageFormData] = useState({});
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
			const { items } = data;
			setItems(items);
		}
	}, [])

	return (
		<ManagePageFormProvider
			pageFormData={pageFormData}
			setPageFormData={setPageFormData}
			formSelected={formSelected}
			setFormSelected={setFormSelected}
			setOpenModal={setOpenModal}
			openModal={openModal}
		>
			<AdminHeader />
			<Button onClick={() => setOpenModal(true)}>Create New Page</Button>
			<Flex>
				{
					items?.map(obj => {
						return <Flex
							width='fit-content'
							border='black solid .1rem'
							borderRadius='.5rem'
							m='1rem'
							alignItems='center'
							padding='.5rem'
						>
							<ListFieldItem item={obj} type='Page' />
						</Flex>
					})
				}
			</Flex>
			<Modal
				isOpen={openModal}
				onClose={() => {
					setOpenModal(false);
					setPageFormData({});
					setFormSelected(prev => {
						return {
							...prev,
							formIndex: 0
						}
					});
				}}
			>
				<ModalOverlay />
				<ModalContent maxW='800px' position='relative'>
					<ModalHeader></ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<PageForm />
						<TemplateForm />
						<AssetForm />
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme='blue'
							mr={3}
							onClick={() => {
								setOpenModal(false);
								setPageFormData({});
								setFormSelected(prev => {
									return {
										...prev,
										formIndex: 0
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
