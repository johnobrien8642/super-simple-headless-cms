import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import Header from './components/Header';
import keys from '../config/keys';
import connectDb from '../lib/mongodb';
import Admin from '../models/Admin';
import Logout from './components/Logout';
import SubscribeForm from './components/Subscribe_Form';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import { Text, UnorderedList, ListItem, Grid } from '@chakra-ui/react'

export default function Home({ data, loggedIn, randPost }) {
	let [active, setActive] = useState(false);
	const router = useRouter();
	const href = keys.url + router.asPath;

	useEffect(() => {
		setTimeout(() => {
			setActive(true);
		}, 500);
		if (loggedIn) {
			window.localStorage.setItem('loggedIn', 'true');
		} else {
			if (window.localStorage.getItem('loggedIn')) {
				window.localStorage.removeItem('loggedIn');
			}
		}
	});

	return (
		<React.Fragment>
			<Header loggedIn={loggedIn} />
			<div className={`${active ? 'active ' : ''}main-page container`}>
				<Head>
					<title>Site Demo</title>
					{/* <link rel="icon" href="/favicon.ico" /> */}
					<meta
						name="description"
						content="A Next.js site demo with photo upload and writing creation features."
					/>
					<link rel="canonical" href={href} />
				</Head>

				<div className="index-container">
					<Text mt='5%' as='h2'>
						Welcome! This site looks simple, but has a lot going on.
					</Text>
					<Text>
						Want to dive under the hood? When you're ready, manually navigate to /admin in the browser
						and use this username and password:
					</Text>
					<UnorderedList>
						<ListItem>
							admin
						</ListItem>
						<ListItem>
							password
						</ListItem>
					</UnorderedList>
					<Text as='h5'>Tech Stack And Libraries</Text>
					<Grid templateColumns={'1fr 1fr'}>
						<UnorderedList>
							<ListItem>
								Next.js
							</ListItem>
							<ListItem>
								React
							</ListItem>
							<ListItem>
								Typescript
							</ListItem>
							<ListItem>
								Mongodb
							</ListItem>
							<ListItem>
								Mongoose
							</ListItem>
							<ListItem>
								Bootstrap
							</ListItem>
							<ListItem>
								Sass
							</ListItem>
						</UnorderedList>
						<UnorderedList>
							<ListItem>
								ChakraUI
							</ListItem>
							<ListItem>
								Formik
							</ListItem>
							<ListItem>
								JSON Web Token
							</ListItem>
							<ListItem>
								bcrypt
							</ListItem>
							<ListItem>
								React Ace Code Editor
							</ListItem>
						</UnorderedList>
					</Grid>
					<Text as='h5'>What can you do?</Text>
					<UnorderedList>
						<ListItem>
							Create pieces of writing with chapters.
						</ListItem>
						<ListItem>
							Upload pictures.
						</ListItem>
						<ListItem>
							Accept email subscriptions and send emails. Try subscribing with your email below,
							check your spam if you don't see it right away! Unsubscribe link included in all
							emails.
						</ListItem>
						<ListItem>
							Sign in as an admin and get access to delete and edit functionality,
							as well as a repl window for interacting directly with the database!
						</ListItem>
					</UnorderedList>
					<Text as='h5'>What's behind the scenes?</Text>
					<UnorderedList>
						<ListItem>
							Mongodb Atlas
						</ListItem>
						<ListItem>
							Amazon S3 (For uploading images), Cloudfront (for serving those images), and SES (Simple Email Service)
						</ListItem>
						<ListItem>
							Vercel (for hosting and deployment management)
						</ListItem>
					</UnorderedList>
					<SubscribeForm />
					<div className="bottom-links">
						<Text m={0} textDecoration={'underline'}>
							<Link
								href="/pieces/roll"
								className="nav-link pieces-link"
								passHref
							>
								Writing
							</Link>
						</Text>
						<Text m={0} textDecoration={'underline'}>
							<Link
								href="/posts/photos/roll"
								className="nav-link pieces-link"
								passHref
							>
								Pictures
							</Link>
						</Text>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export async function getServerSideProps(context) {
	await connectDb();
	let decoded;

	if (context.req.cookies.token) {
		decoded = jwt.verify(context.req.cookies.token, process.env.NEXT_PUBLIC_SECRET_KEY);
	}
	const authenticated = await Admin.findById(decoded?.id);

	return {
		props: { loggedIn: !!authenticated }
	};
}
