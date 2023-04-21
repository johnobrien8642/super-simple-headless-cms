import Head from 'next/head';
import { useRouter } from 'next/router';
import PostShow from '../components/Post_Show';
import Header from '../components/Header';
import keys from '../../config/keys';
import connectDb from '../../lib/mongodb.js';
import Post from '../../models/Post';
import { Button } from '@chakra-ui/react'

function SinglePost({ post, blurDataUrl }) {
	const router = useRouter();
	const path = (keys.url = router.asPath);

	return (
		<div className="outer-container">
			<Header />
			<div className="single-post-show container">
				<Head>
					<link rel="canonical" href={path} />
				</Head>
				<Button
					className="go-back-btn"
					onClick={(e) => {
						e.preventDefault();
						const path =
							JSON.parse(post).type === 'Photo'
								? 'photos'
								: 'books';
						router.push(`/posts/${path}/roll`);
					}}
				>
					Go back
				</Button>
				<PostShow
					post={JSON.parse(post)}
					blur={blurDataUrl}
					single={true}
				/>
			</div>
		</div>
	);
}

export async function getStaticPaths() {
	await connectDb();
	const posts = await Post.find({});

	const paths = posts.map((post) => ({
		params: { id: post._id.toString() }
	}));
	return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
	await connectDb();
	const post = await Post.findById(params.id);

	return { props: { post: JSON.stringify(post) } };
}

export default SinglePost;
