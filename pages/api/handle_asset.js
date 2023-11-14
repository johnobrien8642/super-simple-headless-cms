import connectDb from '../../lib/mongodb.js';
import Assets from '../../models/Assets';
import { getPlaiceholder } from 'plaiceholder';

export default async (req, res) => {
	await connectDb();

	if (req.method === 'POST') {
		const {
			data: {
				assetKey,
				thumbnailKey,
				blurString,
				title,
				description,
				type
			},
			update,
			itemToEditId
		} = req.body

		let asset;
		if (update !== 'Assets') {
			asset = new Assets({
				assetKey,
				thumbnailKey,
				title,
				description,
				type
			});
			try {
				const savedAsset = await asset.save();
				return res.status(200).json({ success: true, savedAssetId: savedAsset._id });
			} catch (err) {
				return res.status(500).json({ success: false, errorMessage: err.message });
			}
		} else {
			try {
				asset = await Assets.findOneAndUpdate(
					{ _id: itemToEditId },
					{
						assetKey,
						thumbnailKey,
						title,
						description,
						type
					}
				)
				return res.status(200).json({ success: true, savedAssetId: asset._id });
			} catch (err) {
				return res.status(500).json({ success: false, errorMessage: err.message });
			}
		}

	}
};
