import React, { useEffect, useState } from 'react'
import connectDb from '../../../lib/mongodb.js';
import Admin from '../../../models/Admin';
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
	Flex,
} from '@chakra-ui/react'
import AdminHeader from '../../../util/components/AdminHeader';
import PageForm from '../../../util/components/PageForm';
import TemplateForm from '../../../util/components/TemplateForm';
import AssetForm from '../../../util/components/AssetForm';
import { useRouter } from 'next/router';
import { ManagePageFormProvider, dataInitialValue, editItemTraceObjInitObj } from '../../../util/contexts/useManagePageForm.tsx';
import ListFieldItem from '../../../util/components/ListFieldItem';
import Head from 'next/head';
import { AllDocUnionType } from '../../../util/components/types/util_types.ts';
import { GetServerSideProps, NextPage } from 'next';

const ManagePages: NextPage<{}> = () => {
	const [topLevelModal, setTopLevelModal] = useState(false);
	const [formSelected, setFormSelected] = useState({
		formTitle: 'Page',
		formIndex: 0,
		editItemTraceObj: editItemTraceObjInitObj,
		update: '',
		loading: false
	});
	const [data, setData] = useState(dataInitialValue);
	const [items, setItems] = useState<AllDocUnionType[]>([]);
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
				<AdminHeader title='Manage Pages' />
				<Button
					m='1rem 2rem'
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
						if (!formSelected.loading) {
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
						}
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
								{formSelected.editItemTraceObj['Page'] ? 'Close Update Page Form' : 'Close New Page Form'}
							</Button>
						</ModalFooter>
					</ModalContent>
				</Modal>
			</ManagePageFormProvider>
		</>
	)
}

export const getServerSideProps: GetServerSideProps = async (context) => {
	await connectDb();
	let decoded;
	let token = context.req.cookies[process.env.NEXT_PUBLIC_LOGGED_IN_VAR as string];
	if (token) {
		decoded = jwt.verify(
			token,
			process.env.NEXT_PUBLIC_SECRET_KEY as string
		) as { id?: string; };
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
