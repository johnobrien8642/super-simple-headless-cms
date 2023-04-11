import connectDb from '../../lib/mongodb.js';
import Post from '../../models/Post';

export default async (req, res) => {
	await connectDb();

	if (req.method === 'GET') {
		try {
			const posts = await Post.find({});
			const rand = Math.floor(Math.random() * posts.length);
			res.status(200).json({ success: true, post: posts[rand] });
		} catch (err) {
			res.status(500).json({ success: false, errorMessage: err.message });
		}
	}
};
