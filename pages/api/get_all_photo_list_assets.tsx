import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../lib/mongodb.js';
import Templates from '../../models/Templates';
import { AssetsType } from '../../models/Assets';
export const config = {
	api: {
		bodyParser: {
			sizeLimit: '50mb',
		},
	},
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await connectDb();
	try {
		const items = await Templates.find({ type: 'Photo List' }).populate('assetsIds');
		let allImages: AssetsType[] = [];
		for (let i = 0; i < items.length; i++) {
			allImages = [...allImages, ...items[i].assetsIds];
		}
		return res.status(200).json({ allImages });
	} catch (err: any) {
		console.log(err)
		return res.status(500).json({ error: 'Get all photo list assets failed', message: err.message });
	}
};