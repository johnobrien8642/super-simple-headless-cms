import React, { useState } from 'react';
import Head from 'next/head';
import jwt from 'jsonwebtoken'
import { useRouter } from 'next/router';
import PostShow from '../../components/Post_Show';
import Header from '../../components/Header';
import connectDb from '../../../lib/mongodb';
import Post from '../../../models/Post';
import Admin from '../../../models/Admin';
import InfiniteScroll from 'react-infinite-scroll-component';

const Roll = ({ posts, loggedIn }) => {
	const router = useRouter();
	const href = process.env.URL + router.asPath;
	let [postsHook, setPosts] = useState(JSON.parse(posts));

	function handleRowDivider(p, i) {
		let i2 = 0;
		i2 += i + 1;
		if (i2 % 2 === 0) {
			return <div key={p._id} className="w-100"></div>;
		}
	}

	async function fetchMore() {
		const _id = postsHook[postsHook.length - 1]._id;
		const res = await fetch(`/api/get_photos`, {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				_id
			})
		});
		const data = await res.json();
		setPosts([...postsHook, ...data.posts]);
	}

	return (
		<React.Fragment>
			<Head>
				<link rel="canonical" href={href} />
			</Head>
			<Header loggedIn={loggedIn}/>
			<div className="roll container">
				<div className="inner row">
					<InfiniteScroll
						dataLength={postsHook.length}
						next={fetchMore}
					>
						{postsHook.map((p, i) => {
							return (
								<React.Fragment key={p._id}>
									<PostShow post={p} />
									{handleRowDivider(p, i)}
								</React.Fragment>
							);
						})}
					</InfiniteScroll>
				</div>
			</div>
		</React.Fragment>
	);
};

export async function getServerSideProps(context) {
	await connectDb();
	let decoded;
	if (context.req.cookies.token) {
		decoded = jwt.verify(context.req.cookies.token, process.env.NEXT_PUBLIC_SECRET_KEY);
	}

	const authenticated = await Admin.findById(decoded?.id);
	const posts = await Post.find({
		type: 'Photo'
	});

	return { props: { loggedIn: !!authenticated, posts: JSON.stringify(posts) } };
}

export default Roll;
