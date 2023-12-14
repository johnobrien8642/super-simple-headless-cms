import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../lib/mongodb.js';
import Templates from '../../models/Templates';
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
		folderHref
	} = req.body;
	let template;
	if (req.method === 'POST') {
		template = new Templates({
			...data
		});
		const savedTemplate = await template.save();
		try {
			if (folderHref) {
				await res.revalidate(folderHref);
			}
			return res.status(200).json({ success: true, templateId: savedTemplate._id });
		} catch (err: any) {
			return res.status(500).json({ success: false, errorMessage: err.message });
		}
	} else if (req.method === 'PUT') {
		try {
			template = await Templates.findOneAndUpdate(
				{ _id: itemToEditId },
				{
					...data
				}
			);
			if (folderHref) {
				await res.revalidate(folderHref);
			}
			return res.status(200).json({ success: true, templateId: template._id });
		} catch (err: any) {
			return res.status(500).json({ success: false, errorMessage: err.message });
		}
	}
};