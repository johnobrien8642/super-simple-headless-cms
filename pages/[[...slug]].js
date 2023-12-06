import React from 'react';
import Head from 'next/head';
import Header from '../util/components/Header';
import Templates from '../util/components/Templates';
import connectDb from '../lib/mongodb';
import PageManager from '../models/PageManager';
import Page from '../models/Page';

const Home = ({ pageManager, page }) => {
	const pPage = JSON.parse(page);
	const pPageManager = JSON.parse(pageManager)

	return (
		<>
			<Head>
				<title>{pPage?.meta?.metaTitle}</title>
				<meta
					name="description"
					content={pPage?.meta?.metaDescription}
				/>
				<link rel="canonical" href='https://www.johneobrien.com' />
				<link rel="icon" type="image/icon" href="/icons8-book-ios-16-16.png" />
			</Head>
			<Header
				pages={pPageManager.pageIds}
			/>
			<Templates page={pPage} />
		</>
	);
}

export async function getStaticPaths() {
	await connectDb();
	const pageManager =
		await PageManager
			.find({ title: 'manage-pages' })
				.lean()
					.populate('pageIds')
	const paths = pageManager[0].pageIds.map(obj => {
		return {
			params: {
				slug: [ obj.folderHref.substring(1) ]
			}
		}
	})
	return {
		paths,
		fallback: true
	}
}

export async function getStaticProps(context) {
	await connectDb();
	const pageManager = await PageManager.find({}).populate('pageIds');
	const page =
		await Page
			.find({ folderHref: context.params?.slug?.[0] ? `/${context.params?.slug[0]}` : '/' })
				.lean()
					.populate([{
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
				])

	return {
		props: {
			pageManager: JSON.stringify(pageManager[0]),
			page: JSON.stringify(page[0])
		}
	};
}

export default Home;
