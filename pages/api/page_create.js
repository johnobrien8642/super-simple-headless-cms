import connectDb from '../../lib/mongodb.js';
import Page from '../../models/Page';

export default async (req, res) => {
	await connectDb();

	const postCount = await Page.find({}).count();

	if (req.method === 'POST') {
		const {
			data: {
				title,
				description,
				templatesIds,
			},
			update,
			itemToEditId
		} = req.body
		console.log(update)
		let post
		if (update !== 'Page') {
			post = new Page({
				title,
				description,
				templatesIds
			});
			try {
				const savedPage = await post.save();
				return res.status(200).json({ success: true, _id: savedPage._id });
			} catch (err) {
				return res.status(500).json({ success: false, errorMessage: err.message });
			}
		} else {
			post = await Page
				.findOneAndUpdate(
					{ _id: itemToEditId },
					{
						title,
						description,
						templatesIds
					}
				)
				try {

					return res.status(200).json({ success: true, _id: post._id });
				} catch (err) {
					return res.status(500).json({ success: false, errorMessage: err.message });
				}
			}

	}
};