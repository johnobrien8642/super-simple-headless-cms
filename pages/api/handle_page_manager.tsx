import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../lib/mongodb.js';
import Page from '../../models/Page';
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
	let pageManager = await PageManager.findOne({ title: 'manage-pages' }).populate('pageIds');
	let page;
	if (!pageManager) {
		page = await new Page({
			title: '',
			folderHref: '/',
			description: '',
			templatesIds: [],
			meta: {
				metaTitle: '',
				metaDescription: ''
			}
		}).save()
		pageManager = await new PageManager({ title: 'manage-pages', pageIds: [page._id] }).save().then((pg: HydratedPageManagerType) => pg.populate('pageIds'))
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