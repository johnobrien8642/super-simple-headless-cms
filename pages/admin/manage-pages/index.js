import React, { useEffect, useState } from 'react'
import connectDb from '../../../lib/mongodb.js';
import Link from 'next/link';
import Admin from '../../../models/Admin.ts';
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
import AdminHeader from '../../../util/components/AdminHeader.js';
import PageForm from '../../../util/components/PageForm.js';
import TemplateForm from '../../../util/components/TemplateForm.js';
import AssetForm from '../../../util/components/AssetForm.js';
import { useRouter } from 'next/router';
import { ManagePageFormProvider, dataInitialValue } from '../../../util/contexts/useManagePageForm.tsx';
import ListField from '../../../util/components/ListField.js';
import ListFieldItem from '../../../util/components/ListFieldItem.js';
import Head from 'next/head';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';


const ManagePages = ({ admin }) => {
	const [topLevelModal, setTopLevelModal] = useState(false);
	const [formSelected, setFormSelected] = useState({ formTitle: 'Page', formIndex: 0, editItemTraceObj: { 'Page': '', 'Templates': '', 'Assets': '' }, update: false });
	const [data, setData] = useState(dataInitialValue);
	const [items, setItems] = useState([]);
	const [renderCount, setRenderCount] = useState(0);
	const router = useRouter();

	useEffect(() => {
		handleGetList();
		async function handleGetList() {
			const res = await fetch('/api/handle_page_manager',
			{
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			const data = await res.json();
			const { pageManager } = data;
			setItems(pageManager.pageIds);
		}
	}, [topLevelModal]);

	useEffect(() => {
		handleGetList();
		async function handleGetList() {
			if (!items.length) return;
			const res = await fetch('/api/handle_page_manager',
			{
				method: 'PUT',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					pageIdArr: items.map(obj => obj._id)
				})
			})
		}
	}, [items]);

	return (
		<>
			<Head>
				<link rel="shortcut icon" href="data:image/x-icon;," type="image/x-icon" />
			</Head>
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
				<Flex
					flexDir='column'
					maxW='1200px'
				>
					{
						items?.map((obj, index) => {
							return <ListFieldItem
								key={obj._id}
								item={obj}
								type='Page'
								noForm={true}
								setItems={setItems}
								index={index}
							/>
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
					<ModalContent maxW='1200px' position='relative'>
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
		</>
	)
}

export async function getServerSideProps(context) {
	await connectDb();
	let decoded;
	if (context.req.cookies.token) {
		decoded = jwt.verify(context.req.cookies.token, process.env.NEXT_PUBLIC_SECRET_KEY);
	}
	const authenticated = await Admin.findById(decoded?.id);

	if (authenticated) {
		return {
			props: {
				admin: !!authenticated
			}
		};
	} else {
		return {
			redirect: {
				permanent: false,
				destination: "/admin",
			},
			props: {
				admin: !!authenticated
			}
		};
	}

}

export default ManagePages;
