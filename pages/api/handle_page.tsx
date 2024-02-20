import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../lib/mongodb.js';
import Page from '../../models/Page';
import PageManager from '../../models/PageManager';
export const config = {
	api: {
		bodyParser: {
			sizeLimit: '50mb',
		},
	},
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await connectDb();
	const {
		data,
		update,
		itemToEditId,
		folderHref,
		parentId
	} = req.body

	let page;
	let parentPage;
	let pageExistsAlready;
	let pageManager;
	if (req.method === 'POST') {
		page = new Page({
			...data
		});
		pageExistsAlready = await Page.find({ folderHref: page.folderHref });
		if (!pageExistsAlready.length) {
			if (parentId) {
				parentPage = await Page.findById(parentId);
				parentPage.childPagesIds.push(page._id);
				await parentPage.save();
			}
			try {
				page.folderHref = (parentPage.folderHref === '/' ? '' : parentPage.FolderHref) + page.folderHref;
				const savedPage = await page.save();
				if (!parentId) {
					pageManager = await PageManager.findOne({ title: 'manage-pages' });
					await PageManager.findOneAndUpdate({ _id: pageManager._id }, { pageIds: [...pageManager.pageIds, savedPage._id] });
				}
				return res.status(200).json({ success: true, _id: savedPage._id, parent: parentPage });
			} catch (err: any) {
				return res.status(500).json({ success: false, errorMessage: err.message });
			}
		} else {
			return res.status(400).json({ success: false, errorMessage: `Page with folderHref: ${page.folderHref} already exists` });
		}
	} else if (req.method === 'PUT') {
		try {
			page = await Page.findById(itemToEditId);
			if (parentId) {
				parentPage = await Page.findById(parentId);
				page.folderHref = (parentPage.folderHref === '/' ? '' : parentPage.FolderHref) + page.folderHref;
			}
			await Page.findOneAndUpdate(
				{ _id: itemToEditId },
				{
					...page
				}
			);
			await res.revalidate(page.folderHref);
			return res.status(200).json({ success: true, _id: page._id, parent: parentPage });
		} catch (err: any) {
			return res.status(500).json({ success: false, errorMessage: err.message });
		}
	}
};
