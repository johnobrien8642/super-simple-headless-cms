import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../lib/mongodb.js';
import PageManager, { HydratedPageManagerType } from '../../models/PageManager';
export const config = {
	api: {
		bodyParser: {
			sizeLimit: '50mb',
		},
	},
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await connectDb();
	let pageManager = await PageManager.findOne({ title: 'manage-pages'}).populate('pageIds');

	if (!pageManager) {
		pageManager = await new PageManager({ title: 'manage-pages' }).save()
	}

	if (req.method === 'PUT') {
		const { pageIdArr } = req.body;
		pageManager.pageIds = pageIdArr;
		try {
			const savedPageManager = await pageManager.save().then((pg: HydratedPageManagerType) => pg.populate('pageIds'));
			return res.status(200).json({ success: true, pageManager: savedPageManager });
		} catch (err: any) {
			return res.status(500).json({ success: false, errorMessage: err.message });
		}
	} else if (req.method === 'GET') {
		return res.status(200).json({ success: true, pageManager });
	}
};