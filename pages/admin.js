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

const AdminPage = ({ data }) => {
	function handleComponents() {
		if (data) {
			return (
				<React.Fragment>
					<Head>
						<meta name="robots" content="noindex,nofollow" />
					</Head>
					<Logout />
					<Text as='h3' textDecoration={'underline'}><Link href={'/piece/add_or_update'}>Create Writing</Link></Text>
					<Text as='h3' textDecoration={'underline'}><Link href={'/posts/create_post'}>Create Post</Link></Text>
					<Text as='h3' textDecoration={'underline'}><Link href={'/'}>Main Page</Link></Text>
					<Text as='h3' textDecoration={'underline'}><Link href={'/util/send_emails'}>Send Emails</Link></Text>
					<Text as='h3' textDecoration={'underline'}><Link href={'/auth/repl'}>Repl</Link></Text>
					<Text fontSize='1.2rem' mt='5%'>Admins can perform any of the actions above.</Text>
					<Text fontSize='1.2rem'>Check out the Repl window to interact directly with the database!</Text>
				</React.Fragment>
			);
		} else {
			return (
				<React.Fragment>
					<Login />
				</React.Fragment>
			);
		}
	}

	return (
		<div className="admin-container container">{handleComponents()}</div>
	);
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
