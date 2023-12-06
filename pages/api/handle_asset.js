import connectDb from '../../lib/mongodb.js';
import Assets from '../../models/Assets';
import { getPlaiceholder } from 'plaiceholder';
export const config = {
	api: {
		bodyParser: {
			sizeLimit: '50mb',
		},
	},
}
export default async (req, res) => {
	await connectDb();
	const {
		data,
		update,
		itemToEditId,
		folderHref
	} = req.body
	let blurBase64;
		try {
			if (data.assetKey) {
				const src = process.env.NEXT_PUBLIC_CLOUDFRONT_URL + data.assetKey
				const buffer = await fetch(src).then(async (res) =>
					Buffer.from(await res.arrayBuffer())
				);
				const { base64 } = await getPlaiceholder(buffer, { size: 29 });
				blurBase64 = base64
			}
		} catch (err) {
			return res.status(500).json({ success: false, errorMessage: `Error trying to create blur: ${err.message}` });
		}
	let asset;
	if (req.method === 'POST') {
		asset = new Assets({
			...data,
			blurString: blurBase64
		});
		try {
			const savedAsset = await asset.save();
			if (folderHref) {
				await res.revalidate(folderHref);
			}
			return res.status(200).json({ success: true, savedAssetId: savedAsset._id });
		} catch (err) {
			return res.status(500).json({ success: false, errorMessage: `Error trying to create asset: ${err.message}` });
		}
	} else if (req.method === 'PUT') {
		try {
			asset = await Assets.findOneAndUpdate(
				{ _id: itemToEditId },
				{
					...data,
					blurString: blurBase64
				}
			)
			if (folderHref) {
				await res.revalidate(folderHref);
			}
			return res.status(200).json({ success: true, savedAssetId: asset._id });
		} catch (err) {
			return res.status(500).json({ success: false, errorMessage: `Error trying to update: ${err.message}` });
		}
	}
};
