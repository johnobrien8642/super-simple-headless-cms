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
					<title>John E. O'Brien</title>
					{/* <link rel="icon" href="/favicon.ico" /> */}
					<meta
						name="description"
						content="A writer and musician who also likes to take a picture or two when travelling."
					/>
					<link rel="canonical" href={href} />
				</Head>

				<div className="index-container">
					<div className="picture-cont my-3">
						<Image
							width="800"
							height="400"
							objectFit="contain"
							className="w-100"
							src="https://d10v7123g4b5wr.cloudfront.net/DSCF3563.jpg"
							alt="post image"
						/>
					</div>
					<p>
						My name's John, I was born in Massachusetts, and I
						currently reside in Denver. I write
						stream-of-consciousness and contemporary fiction. I also
						take pictures sometimes, usually when I'm traveling.
						Lastly, for my day-job, I'm a professional programmer.
						My main language is Javascript, and I've recently begun
						learning Rust. Links for everything above.
					</p>
					<p>johnedwardobrienartist@gmail.com</p>
					<SubscribeForm />
					<div className="bottom-links">
						<Link
							href="/pieces/roll"
							className="nav-link pieces-link"
							passHref
						>
							Writing
						</Link>
						<Link
							href="/photos/roll"
							className="nav-link pieces-link"
							passHref
						>
							Pictures
						</Link>
						<Link
							href="/coding/links"
							className="nav-link pieces-link"
							passHref
						>
							Coding
						</Link>
			 P       </div>
				</div>
			</div>
		</React.Fragment>
	);
}

export async function getServerSideProps(context) {
	await connectDb();
	let decoded;

	if (context.req.cookies.token) {
		decoded = jwt.verify(context.req.cookies.token, process.env.SECRET_KEY);
	}
	const authenticated = await Admin.findById(decoded?.id);

	return {
		props: { loggedIn: !!authenticated }
	};
}
