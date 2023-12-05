import connectDb from '../../lib/mongodb.js';
import Templates from '../../models/Templates';
export const config = {
	api: {
		bodyParser: {
			sizeLimit: '50mb',
		},
	},
}

export default async (req, res) => {
	await connectDb();
	if (req.method === 'POST') {
		const {
			data,
			update,
			itemToEditId
		} = req.body

		let template;
		if (update !== 'Templates') {
			template = new Templates({
				...data
			});
		} else {
			try {
				template = await Templates.findOneAndUpdate(
					{ _id: itemToEditId },
					{
						...data
					}
				);
				return res.status(200).json({ success: true, templateId: template._id });
			} catch (err) {
				return res.status(500).json({ success: false, errorMessage: err.message });
			}
		}

		try {
			const savedTemplate = await template.save();
			return res.status(200).json({ success: true, templateId: savedTemplate._id });
		} catch (err) {
			return res.status(500).json({ success: false, errorMessage: err.message });
		}
	}
};