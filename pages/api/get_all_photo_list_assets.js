import Templates from '../../models/Templates';

export default async (req, res) => {
	try {
		const items = await Templates.find({ type: 'Photo List' }).populate('assetsIds');
		let allImages = [];
		for (let i = 0; i < items.length; i++) {
			allImages = [...allImages, ...items[i].assetsIds];
		}
		return res.status(200).json({ allImages });
	} catch (err) {
		console.log(err)
		return res.status(500).json({ error: 'Get all photo list assets failed', message: err.message });
	}
};