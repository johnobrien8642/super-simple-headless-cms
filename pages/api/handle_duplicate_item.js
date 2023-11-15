import connectDb from '../../lib/mongodb.js';
import models from '../../lib/index'
import mongoose from 'mongoose';

export default async (req, res) => {
	await connectDb();

	if (req.method === 'POST') {
		const {
			item,
			schema,
			chosen
		} = req.body

		try {
			const newItem = new models[schema]({ ...item });
			newItem._id = new mongoose.Types.ObjectId();
			const savedNewItem = await newItem.save();
			return res.status(200).json({ success: true, savedNewItem: savedNewItem });
		} catch (err) {
			return res.status(500).json({ success: false, errorMessage: err.message });
		}
	}
};
