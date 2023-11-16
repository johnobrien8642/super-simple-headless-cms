import connectDb from '../../lib/mongodb.js';
import Page from '../../models/Page';
import PageManager from '../../models/PageManager';

export default async (req, res) => {
	await connectDb();

	if (req.method === 'POST') {
		const {
			data,
			update,
			itemToEditId
		} = req.body

		let page;
		let pageExistsAlready;
		if (update !== 'Page') {
			page = new Page({
				...data
			});
			pageExistsAlready = await Page.find({ folderHref: page.folderHref });
			if (!pageExistsAlready.length) {
				try {
					let pageManager = await PageManager.findOne({ title: 'manage-pages' });
					const savedPage = await page.save();
					await PageManager.findOneAndUpdate({ _id: pageManager._id }, { pageIds: [...pageManager.pageIds, savedPage._id] });
					return res.status(200).json({ success: true, _id: savedPage._id });
				} catch (err) {
					return res.status(500).json({ success: false, errorMessage: err.message });
				}
			} else {
				return res.status(400).json({ success: false, errorMessage: `Page with folderHref: ${page.folderHref} already exists` });
			}
		} else {
			try {
				page = await Page
					.findOneAndUpdate(
						{ _id: itemToEditId },
						{
							...data
						}
					)
				return res.status(200).json({ success: true, _id: page._id });
			} catch (err) {
				return res.status(500).json({ success: false, errorMessage: err.message });
			}
		}

	}
};