import React, { useEffect } from 'react';
import Head from 'next/head';
import Login from '../../util/components/Login';
import connectDb from '../../lib/mongodb';
import Admin from '../../models/Admin';
import jwt from 'jsonwebtoken';
import { Text } from '@chakra-ui/react'
import AdminHeader from '../../util/components/AdminHeader';
import { useRouter } from 'next/router';
import { AdminType } from '../../models/Admin';
import { GetServerSideProps, NextPage } from 'next';

type PageProps = {
	admin: AdminType;
}

const AdminPage: NextPage<PageProps> = ({ admin }) => {
	const router = useRouter();
	useEffect(() => {
		if (admin) {
			router.push('/admin/manage-pages')
		}
	}, [])
	if (!admin) {
		return (
			<>
				<Head>
					<meta name="robots" content="noindex,nofollow" />
				</Head>
				<Login />
			</>
		);
	} else {
		return <></>
	}
};

export const getServerSideProps: GetServerSideProps = async (context) => {
	await connectDb();
	let decoded;
	if (context.req.cookies.token) {
		decoded = jwt.verify(context.req.cookies.token, process.env.NEXT_PUBLIC_SECRET_KEY as string) as { id?: string; };
	}
	const authenticated = await Admin.findById(decoded?.id);
	return {
		props: {
			admin: !!authenticated
		}
	};
}

export default AdminPage;
