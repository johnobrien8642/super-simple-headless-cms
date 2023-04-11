import connectDb from '../../lib/mongodb.js';
import Post from '../../models/Post';
import { getPlaiceholder } from 'plaiceholder';

export default async (req, res) => {
	await connectDb();

	const postCount = await Post.find({}).count();

	if (req.method === 'POST') {
		const { link, title, description, price, type } = req.body;

		const linkStr = `https://d10v7123g4b5wr.cloudfront.net/${link}`;

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
