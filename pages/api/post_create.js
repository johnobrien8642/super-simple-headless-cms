import connectDb from '../../lib/mongodb.js';
import Post from '../../models/Post';
import { getPlaiceholder } from 'plaiceholder';
import { FSx } from 'aws-sdk';

export default async (req, res) => {
	await connectDb();

	const postCount = await Post.find({}).count();

	if (req.method === 'POST') {
		const { fileKey, url, title, description, price, type } = req.body

		const linkStr = `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${fileKey}`;

		const { base64 } = await getPlaiceholder(linkStr);

		const post = new Post({
			link: linkStr,
			blurString: base64,
			title: title,
			description: description,
			price: price,
			type: type,
			number: postCount + 1
		});
		try {
			await post.save();
			res.status(200).json({ success: true });
		} catch (err) {
			res.status(500).json({ success: false, errorMessage: err.message });
		}
	}
};
