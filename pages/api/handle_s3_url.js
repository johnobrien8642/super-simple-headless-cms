import connectDb from '../../lib/mongodb.js';
import { getPlaiceholder } from 'plaiceholder';
import aws from 'aws-sdk'

export default async (req, res) => {
	await connectDb();
	const { name, type } = req.body;
	const s3 = new aws.S3({
		accessKeyId: process.env.NEXT_PUBLIC_MY_AWS_ACCESS_KEY,
		secretAccessKey: process.env.NEXT_PUBLIC_MY_AWS_SECRET_ACCESS_KEY,
		signatureVersion: 'v4',
		region: 'us-west-1'
	})

	if (req.method === 'POST') {
		const key = Date.now() + '-' + name

		const fileParams = {
			Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
			Key: key,
			Expires: 600,
			ContentType: type
		}

		try {
			const url = await s3.getSignedUrlPromise('putObject', fileParams)
			console.log(url)
			return res.status(200).json({ url, key })
		} catch (err) {
			return res.status(500).json({ error: err.message })
		}
	} else if (req.method === 'DELETE') {
		const { keysToDelete } = req.body;
		let errors = [];
		let key;
		console.log(keysToDelete)
		for (let i = 0; i < keysToDelete.length; i++) {
			key = keysToDelete[i];
			try {
				await s3.deleteObject({ Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME, Key: key }, function (err, data) {
					if (err) errors.push(err);
				});
			} catch (err) {
				console.log(err)
			}
		}
		if (!errors.length) {
			res.status(200).json({ success: true });
		} else {
			res.status(500).json({ success: false, errors });
		}

	}
};
