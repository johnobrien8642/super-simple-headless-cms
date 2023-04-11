import Image from 'next/image';
import DeleteBtn from './Delete_Btn';
import { useRouter } from 'next/router';

const PostShow = ({ post, single }) => {
	const router = useRouter();

	function handleViewButton() {
		if (!single) {
			return (
				<button
					className="view-btn"
					onClick={(e) => {
						e.preventDefault();
						router.push(`/posts/${post?._id}`);
					}}
				>
					View
				</button>
			);
		}
	}

	const props = {
		width: '1200',
		height: '800',
		objectFit: 'contain',
		className: 'w-100',
		src: post?.link,
		alt: 'post image'
	};

	if (post?.blurString) {
		props.placeholder = 'blur';
		props.blurDataURL = Buffer.from(post.blurString);
	}

	if (post) {
		return (
			<div className="post-show col-md">
				<Image {...props} />
				<p>{post?.description}</p>
				{handleViewButton()}
				<DeleteBtn post={post} />
			</div>
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
