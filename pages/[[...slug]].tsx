import React from 'react';
import Head from 'next/head';
import Header from '../util/components/system/Header';
import Templates from '../util/components/system/Templates';
import connectDb from '../lib/mongodb';
import PageManager, { PageManagerType } from '../models/PageManager';
import Page, { PageType } from '../models/Page';
import { GetStaticProps, NextPage } from 'next';

export type SlugPropsType = {
	pageManager: string;
	page: string;
}

const Home: NextPage<SlugPropsType> = ({ pageManager, page }) => {
	if (!pageManager) {
		return <></>
	} else {
		const pPage: PageType = JSON.parse(page);
		const pPageManager: PageManagerType = JSON.parse(pageManager);
		return (
			<>
				<Head>
					<title>{pPage?.meta?.metaTitle}</title>
					<meta
						name="description"
						content={pPage?.meta?.metaDescription as string}
					/>
					<link rel="canonical" href='' />
					<link rel="icon" type="image/icon" href="/icons8-book-ios-16-16.png" />
				</Head>
				<Header
					pages={pPageManager.pageIds}
				/>
				<Templates templates={pPage.templatesIds} />
			</>
		);
	}
}

export const getStaticPaths = async () => {
	await connectDb();
	const pages =
		await Page
			.find({})
				.populate('childPagesIds');
	let paths: any = [];
	if (pages) {
		paths = pages?.map((obj: any) => {
			return {
				params: {
					slug: [ obj.folderHref.substring(1) ]
				}
			}
		});
	}
	return {
		paths,
		fallback: false
	}
}

export const getStaticProps: GetStaticProps<SlugPropsType> = async (context) => {
	await connectDb();
	const pageManager =
		await PageManager
			.findOne({});
	const page =
		await Page
			.findOne({ folderHref: context.params?.slug?.[0] ? `/${context.params?.slug[0]}` : '/' })
				.populate([
					{
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
	if (!pageManager || !page) {
		return {
			redirect: {
				permanent: false,
				destination: "/admin",
			}
		};
	} else {
		return {
			props: {
				pageManager: JSON.stringify(pageManager),
				page: JSON.stringify(page)
			}
		};
	}
}

export default Home;
