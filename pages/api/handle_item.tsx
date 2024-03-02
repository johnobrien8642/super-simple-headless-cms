import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../lib/mongodb.js';
import models from '../../lib/index';
import PageManager from '../../models/PageManager';
export const config = {
	api: {
		bodyParser: {
			sizeLimit: '50mb',
		},
	},
}

function deleteAdminFields(data: any) {
	delete data.previous;
	delete data.formTitle;
	delete data.update;
	delete data.parentFieldTitle;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await connectDb();
	const {
		data,
		folderHref,
		// update,
		// itemToEditId,
		// parentId
	} = req.body

	let item;
	let parentItem;
	let itemExistsAlready;
	let pageManager;
	let parentFieldTitleRef = data.parentFieldTitle;
	let formTitleRef = data.formTitle;
	if (req.method === 'POST') {
		if (formTitleRef === 'Page') {
			itemExistsAlready = await models[formTitleRef].findOne({ folderHref: data.folderHref });
			if (itemExistsAlready) {
				return res.status(400).json({ success: false, errorMessage: `Page with folderHref: ${data.folderHref} already exists` });
			}
		}
		if (data.previous) {
			parentItem = await models[formTitleRef].findById(data.previous);
			if (parentItem) {
				parentItem[data.parentFieldTitle].push(data._id);
				if (data.formTitle === 'Page') {
					data.folderHref = (parentItem.folderHref === '/' ? '' : parentItem.folderHref) + data.folderHref;
				}
				await parentItem.save();
			}
		}
		try {
			deleteAdminFields(data);
			item = new models[formTitleRef]({
				...data
			});
			const savedItem = await item.save();
			if (!parentItem && formTitleRef) {
				pageManager = await PageManager.findOne({ title: 'manage-pages' });
				await PageManager.findOneAndUpdate({ _id: pageManager._id }, { pageIds: [...pageManager.pageIds, savedItem._id] });
			}
			return res.status(200).json({ success: true, _id: savedItem._id, parent: parentItem, parentFieldTitleRef, savedItem });
		} catch (err: any) {
			return res.status(500).json({ success: false, errorMessage: err.message });
		}
	} else if (req.method === 'PUT') {
		const _id = data._id;
		delete data._id;
		try {
			item = await models[formTitleRef].findById(_id);
			parentItem = await models[formTitleRef].findById(data.previous);
			if (parentItem && parentItem.schemaName === formTitleRef && formTitleRef === 'Page') {
				data.folderHref = (parentItem.folderHref === '/' ? '' : parentItem.folderHref) + data.folderHref;
			}
			deleteAdminFields(data)
			await models[formTitleRef].findOneAndUpdate(
				{ _id },
				{
					...data
				}
			);
			try {
				await res.revalidate(item.folderHref);
			} catch (err) {
			}
			return res.status(200).json({ success: true, _id: item._id, parent: parentItem, parentFieldTitleRef, savedItem: { _id } });
		} catch (err: any) {
			return res.status(500).json({ success: false, errorMessage: err.message });
		}
	}
};
