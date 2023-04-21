import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import Form from '../components/Form';
import connectDb from '../../lib/mongodb';
import Admin from '../../models/Admin';
import jwt from 'jsonwebtoken';
import { Text, Center } from '@chakra-ui/react'

const CreatePost = ({ data }) => {
	const router = useRouter();

	useEffect(() => {
		if (!data) {
			router.push('/admin');
		}
	}, []);

	return (
		<React.Fragment>
			<Head>
				<meta name="robots" content="noindex,nofollow" />
			</Head>
			<div className="create-post-container container">
				<Center>
					<Link href={'/admin'}><Text as='h3' textDecoration={'underline'}>Admin Page</Text></Link>
					<Link href={'/auth/repl'}><Text as='h3'textDecoration={'underline'}>Repl</Text></Link>
					<Link href={'/'}><Text as='h3' textDecoration={'underline'}>Main Page</Text></Link>
					<Form />
				</Center>
			</div>
		</React.Fragment>
	);
};

export async function getServerSideProps(context) {
	await connectDb();
	const decoded = jwt.verify(
		context.req.cookies.token,
		process.env.NEXT_PUBLIC_SECRET_KEY
	);
	const authenticated = await Admin.findById(decoded.id);

	return {
		props: {
			data: !!authenticated
		}
	};
}

export default CreatePost;
