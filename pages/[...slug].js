import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from './components/Header';
import keys from '../config/keys';
import connectDb from '../lib/mongodb';
import Admin from '../models/Admin';
import PageManager from '../models/PageManager';
import Logout from './components/Logout';
import SubscribeForm from './components/Subscribe_Form';
import jwt from 'jsonwebtoken';
import { Text, UnorderedList, ListItem, Grid } from '@chakra-ui/react'
import TemplateMap from './util/TemplateMap';
import { useRouter } from 'next/router';

export default function Home({ loggedIn, pageManager }) {
	const [pageSelected, setPageSelected] = useState('');
	const [active, setActive] = useState(false);
	const router = useRouter();
	const href = keys.url + router.asPath;
	const pPageManager = JSON.parse(pageManager)



	useEffect(() => {
		setTimeout(() => {
			setActive(true);
		}, 500);
		if (loggedIn) {
			window.localStorage.setItem(process.env.NEXT_PUBLIC_LOGGED_IN_VAR, 'true');
		} else {
			if (window.localStorage.getItem(process.env.NEXT_PUBLIC_LOGGED_IN_VAR)) {
				window.localStorage.removeItem(process.env.NEXT_PUBLIC_LOGGED_IN_VAR);
			}
		}
	});

	function renderTemplates(page) {
		page.templatesIds.map(temp => {
			return TemplateMap[temp.type]({ assets: temp.assetsIds })
		})
	}

	return (
		<>
			<Head>
				<title>Site Demo</title>
				{/* <link rel="icon" href="/favicon.ico" /> */}
				<meta
					name="description"
					content="A Next.js site demo with photo upload and writing creation features."
				/>
				<link rel="canonical" href={href} />
			</Head>
			<Header
				pages={pPageManager[0].pageIds}
				pageSelected={pageSelected}
				setPageSelected={setPageSelected}
			/>
			{renderTemplates(pPageManager[0].pageIds.find(obj => obj.folderHref === router.asPath))}
		</>
	);
}

export async function getServerSideProps(context) {
	await connectDb();
	let decoded;

	if (context.req.cookies.token) {
		decoded = jwt.verify(context.req.cookies.token, process.env.NEXT_PUBLIC_SECRET_KEY);
	}
	const authenticated = await Admin.findById(decoded?.id);
	const pageManager =
		await PageManager
			.find({ title: 'manage-pages' })
				.lean()
					.populate({
						path: 'pageIds',
						populate: {
							path: 'templatesIds',
							model: 'Templates',
							populate: {
								path: 'assetsIds',
								model: 'Assets'
							}
						}
					})

	return {
		props: {
			loggedIn: !!authenticated,
			pageManager: JSON.stringify(pageManager)
		}
	};
}
