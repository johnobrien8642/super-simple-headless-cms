import { NextApiRequest, NextApiResponse } from 'next';
import connectDb from '../../lib/mongodb.js';
import Admin from '../../models/Admin';
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
		editorTheme,
		adminId
	} = req.body;
	if (req.method === 'PUT') {
		try {
			await Admin.findOneAndUpdate(
				{ _id: adminId },
				{
					editorTheme
				}
			);
			return res.status(200).json({ success: true });
		} catch (err: any) {
			return res.status(500).json({ success: false, errorMessage: err.message });
		}
	}
};