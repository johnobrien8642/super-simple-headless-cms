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
		isNested,
		parentId,
		itemToEditId,
		folderHref
	} = req.body
	let page;
	let pageExistsAlready;
	if (req.method === 'POST') {
		console.log(data)
		page = new Page({
			...data
		});
		pageExistsAlready = await Page.find({ folderHref: page.folderHref });
		if (!pageExistsAlready.length) {
			try {
				const savedPage = await page.save();
				if (!isNested) {
					let pageManager = await PageManager.findOne({ title: 'manage-pages' });
					await PageManager.findOneAndUpdate({ _id: pageManager._id }, { pageIds: [...pageManager.pageIds, savedPage._id] });
				} else {
					let page = await Page.findById(parentId);
					await Page.findOneAndUpdate(
						{ _id: parentId },
						{
							childPagesIds: [
								...page.childPagesIds,
								savedPage._id
							]
						}
					);
				}
				return res.status(200).json({ success: true, _id: savedPage._id });
			} catch (err: any) {
				return res.status(500).json({ success: false, errorMessage: err.message });
			}
		} else {
			return res.status(400).json({ success: false, errorMessage: `Page with folderHref: ${page.folderHref} already exists` });
		}
	} else if (req.method === 'PUT') {
		try {
			page = await Page
			.findOneAndUpdate(
				{ _id: itemToEditId },
				{
					...data
				}
				);
			await res.revalidate(folderHref);
			return res.status(200).json({ success: true, _id: page._id });
		} catch (err: any) {
			return res.status(500).json({ success: false, errorMessage: err.message });
		}
	}
};
