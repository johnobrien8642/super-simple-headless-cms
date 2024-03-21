import { NextApiRequest, NextApiResponse } from 'next';
import models from '../../lib/index';
import aws from 'aws-sdk'
export const config = {
	api: {
		bodyParser: {
			sizeLimit: '50mb',
		},
	},
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { item, formTitle, title, keysToDelete } = req.body;
	if (item.schemaName === 'Assets') {
		let filter: { $or: { [key: string]: string }[] } = { $or: [] }
		let title: string;
		let val: string;
		let obj: { [key: string]: string } = {};
		let entries: [string, string][] = Object.entries(keysToDelete);
		for (let i = 0; i < entries.length; i++) {
			obj = {}
			title = entries[i][0];
			val = entries[i][1];
			obj[title] = val;
			filter.$or.push(obj)
		}
		try {
			const assetsStillInUse = await models[item.schemaName].find(filter);
			if (assetsStillInUse.length === 1) {
				const s3 = new aws.S3({
					accessKeyId: process.env.NEXT_PUBLIC_MY_AWS_ACCESS_KEY,
					secretAccessKey: process.env.NEXT_PUBLIC_MY_AWS_SECRET_ACCESS_KEY,
					signatureVersion: 'v4',
					region: 'us-west-1'
				})
				let errors = [];
				let key: string;
				let keysToDeleteArr: string[] = Object.values(keysToDelete);
				for (let i = 0; i < keysToDeleteArr.length; i++) {
					key = keysToDeleteArr[i];
					if (!key) continue;
					try {
						await s3.deleteObject({ Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME ?? '', Key: key }, function (err, data) {
							console.log(err)
							if (err) errors.push(err);
						});
					} catch (err) {
						console.log(err)
					}
				}
			}
		} catch (err: any) {
			res.status(500).json({ error: `Handling s3 failed: ${err.message}` });
		}
	}

	try {
		let updateSchemas;
		const deleteRes = await models[item.schemaName].deleteOne({ _id: item._id });
		if (formTitle) {
			updateSchemas =
				await models[formTitle]
					.updateMany(
						{},
						{
							"$pull": {
								[title]: {
									"$in": [item._id]
								}
							}
						}
					)
		}
		res.status(200).json({ itemDelete: deleteRes, updateSchemas });
	} catch (err: any) {
		res.status(500).json({ errorMessage: `Handling asset delete failed: ${err.message}` });
	}
};