import React, { useCallback, useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from '../util/components/Header';
import Templates from '../util/components/Templates';
import keys from '../config/keys';
import connectDb from '../lib/mongodb';
import Admin from '../models/Admin';
import PageManager from '../models/PageManager';
import Logout from '../util/components/Logout';
import SubscribeForm from '../util/components/Subscribe_Form';
import jwt from 'jsonwebtoken';
import { Text, UnorderedList, ListItem, Grid } from '@chakra-ui/react'
import TemplateMap from '../util/TemplateMap';
import { useRouter } from 'next/router';
import { useParams, useSearchParams } from 'next/navigation';
import { templateOptions } from '../template_options';

export default function Home({ loggedIn, pageManager, page }) {
	const [pageSelected, setPageSelected] = useState({});
	const [active, setActive] = useState(false);
	const router = useRouter();
	const params = useParams();
	const searchParams = useSearchParams();
	const pPageManager = JSON.parse(pageManager);
	const pPage = JSON.parse(page);

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

	return (
		<>
			<Head>
				<title>John E. O'Brien</title>
				<meta
					name="description"
					content={pageSelected?.description}
				/>
				<link rel="canonical" href={keys.url} />
			</Head>
			<Header
				pages={pPageManager[0].pageIds}
			/>
			<Templates page={pPage} />
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
					.populate([{
						path: 'pageIds',
						populate: {
							path: 'templatesIds',
							model: 'Templates',
							populate: [
								{
									path: 'assetsIds',
									model: 'Assets'
								},
								{
									path: 'videoId',
									model: 'Assets'
								}
							],
						}
					}
				])

	const page = pageManager[0].pageIds.find(obj => {
		if (context.resolvedUrl.includes('?')) {
			return context.resolvedUrl.substring(0, context.resolvedUrl.indexOf('?')) === obj.folderHref;
		} else {
			return context.resolvedUrl === obj.folderHref;
		}
	});

	return {
		props: {
			loggedIn: !!authenticated,
			pageManager: JSON.stringify(pageManager),
			page: JSON.stringify(page)
		}
	};
}
