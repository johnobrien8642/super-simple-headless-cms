import connectDb from '../../lib/mongodb.js';
import Page from '../../models/Page';

export default async (req, res) => {
	await connectDb();

	const postCount = await Page.find({}).count();

	if (req.method === 'POST') {
		console.log(req.body)
		const {
			title,
			description,
			update
		} = req.body

		let post
		if (!update) {
			post = new Page({
				title,
				description
			});
		} else {
			// post = await Page.findById(_id)
			// post.title = title
			// post.description = description
			// post.price = price
		}

		try {
			const savedPage = await post.save();
			res.status(200).json({ success: true, _id: savedPage._id });
		} catch (err) {
			res.status(500).json({ success: false, errorMessage: err.message });
		}
	}
};