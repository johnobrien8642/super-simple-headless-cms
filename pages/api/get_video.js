import connectDb from '../../lib/mongodb.js';
import Assets from '../../models/Assets';

export default async (req, res) => {
	await connectDb();
	const { _id } = req.body;

	try {
		const asset = await Assets.find({ _id });
		res.status(200).json({ success: true, video: asset });
	} catch (err) {
		res.status(500).json({ success: false, errorMessage: err.message });
	}
};
