import connectDb from '../../lib/mongodb.js';
import Post from '../../models/Post';

export default async (req, res) => {
	const { id } = req.query;
	await connectDb();

	if (req.method === 'GET') {
		try {
			const post = await Post.findById(id);
			res.status(200).json({ success: true, post: post });
		} catch (err) {
			res.status(500).json({ success: false, errorMessage: err.message });
		}
	}
};
