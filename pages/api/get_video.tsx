import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../lib/mongodb.js';
import Assets from '../../models/Assets';
export const config = {
	api: {
		bodyParser: {
			sizeLimit: '50mb',
		},
	},
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await connectDb();
	const { _id } = req.body;

	try {
		const asset = await Assets.find({ _id });
		res.status(200).json({ success: true, video: asset });
	} catch (err: any) {
		res.status(500).json({ success: false, errorMessage: err.message });
	}
};
