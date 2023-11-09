import React from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Login from './components/Login';
import Logout from './components/Logout';
import NewAdmin from './components/New_Admin';
import connectDb from '../lib/mongodb';
import Admin from '../models/Admin';
import jwt from 'jsonwebtoken';
import { Text } from '@chakra-ui/react'
import AdminHeader from './components/AdminHeader';


const AdminPage = ({ data }) => {

	if (data) {
		return (
			<>
				<Head>
					<meta name="robots" content="noindex,nofollow" />
				</Head>
				<AdminHeader />
				<Text>Welcome to the Admin home page</Text>
			</>
		);
	} else {
		return (
			<>
				<Login />
			</>
		);
	}
};

export async function getServerSideProps(context) {
	await connectDb();
	let decoded;
	if (context.req.cookies.token) {
		decoded = jwt.verify(context.req.cookies.token, process.env.NEXT_PUBLIC_SECRET_KEY);
	}
	const authenticated = await Admin.findById(decoded?.id);

	return {
		props: {
			data: !!authenticated
		}
	};
}

export default AdminPage;
