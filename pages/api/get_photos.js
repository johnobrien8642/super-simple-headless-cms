import connectDb from '../../lib/mongodb.js';
import Post from '../../models/Post';
export const config = {
	api: {
		bodyParser: {
			sizeLimit: '50mb',
		},
	},
}

export default async (req, res) => {
	await connectDb();
	const { _id } = req.body;
	let query = {};

	try {
		if (_id) {
			query = { _id: { $lt: _id } };
		}

		const posts = await Post.find(query).limit(6);

		res.status(200).json({ success: true, posts });
	} catch (err) {
		res.status(500).json({ success: false, errorMessage: err.message });
	}
};
