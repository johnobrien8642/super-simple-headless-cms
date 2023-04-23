import connectDb from '../../lib/mongodb.js';
import Post from '../../models/Post';
import { getPlaiceholder } from 'plaiceholder';

export default async (req, res) => {
	await connectDb();

	const postCount = await Post.find({}).count();

	if (req.method === 'POST') {
		const { fileKey, url, title, description, price, type, update, _id } = req.body
		console.log(_id)
		let post
		if (!update) {
			const linkStr = `${process.env.NEXT_PUBLIC_CLOUDFRONT_URL}/${fileKey}`;

			const { base64 } = await getPlaiceholder(linkStr);
			post = new Post({
				link: linkStr,
				blurString: base64,
				title: title,
				description: description,
				price: price,
				type: type,
				number: postCount + 1
			});
		} else {
			console.log(_id)
			post = await Post.findById(_id)
			post.title = title
			post.description = description
			post.price = price
		}

		try {
			const savedPost = await post.save();
			res.status(200).json({ success: true, _id: savedPost._id });
		} catch (err) {
			res.status(500).json({ success: false, errorMessage: err.message });
		}
	}
};
