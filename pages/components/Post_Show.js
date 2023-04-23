import Image from 'next/image';
import Link from 'next/link'
import DeleteBtn from './Delete_Btn';
import { useRouter } from 'next/router';
import { Button, Text, Card, CardBody } from '@chakra-ui/react'

const PostShow = ({ post, single, loggedIn }) => {
	const router = useRouter();
	console.log(post)
	const { title, description, price, link } = post

	function handleViewButton() {
		if (!single) {
			return (
				<Button
					className="view-btn"
					onClick={(e) => {
						e.preventDefault();
						router.push(`/posts/${post?._id}`);
					}}
				>
					View
				</Button>
			);
		}
	}

	const props = {
		width: '1200',
		height: '800',
		className: 'w-100',
		src: post?.link,
		alt: 'post image'
	};

	if (post?.blurString) {
		props.placeholder = 'blur';
		props.blurDataURL = Buffer.from(post.blurString).toString('base64');
	}

	if (post) {
		return (
			<Card className="post-show col-md" variant='elevated' boxShadow='var(--chakra-shadows-xl)'>
				<Image {...props} />
				<CardBody>
					{!!title &&
						<Text as='h5'>{title}</Text>
					}
					{!!description &&
						<Text fontSize='1.1rem'>{description}</Text>
					}
					{!!price &&
						<Text>{`$${price}`}</Text>
					}
					{handleViewButton(loggedIn)}
				</CardBody>
				{loggedIn &&
					<Text fontSize='1.5rem' m='1rem' textDecoration='underline'>
						<Link href={{
							pathname: '/posts/create_post',
							query: {
								update: true,
								title,
								description,
								price,
								link,
								_id: post._id
							}
						}}>Edit</Link>
					</Text>
				}
				<DeleteBtn post={post} loggedIn={loggedIn} />
			</Card>
		);
	} else {
		return (
			<div className="post-show col-md">
				<p>Sorry, no photos to show yet</p>
			</div>
		);
	}
};

export default PostShow;
