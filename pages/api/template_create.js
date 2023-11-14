import connectDb from '../../lib/mongodb.js';
import Templates from '../../models/Templates';

export default async (req, res) => {
	await connectDb();
	if (req.method === 'POST') {
		const {
			data: {
				title,
				templateType,
				description,
				assetsIds,
			},
			update,
			itemToEditId
		} = req.body

		let template;
		if (update !== 'Templates') {
			template = new Templates({
				title,
				templateType,
				description,
				assetsIds
			});
		} else {
			try {
				template = await Templates.findOneAndUpdate(
					{ _id: itemToEditId },
					{
						title,
						templateType,
						description,
						assetsIds
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