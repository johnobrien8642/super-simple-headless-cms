import connectDb from '../../lib/mongodb.js';
import Post from '../../models/Post';
import { getPlaiceholder } from 'plaiceholder';
import aws from 'aws-sdk'

export default async (req, res) => {
	await connectDb();

	const postCount = await Post.find({}).count();
	const { name, type } = req.body;
	if (req.method === 'POST') {

		const s3 = new aws.S3({
			accessKeyId: process.env.NEXT_PUBLIC_MY_AWS_ACCESS_KEY,
			secretAccessKey: process.env.NEXT_PUBLIC_MY_AWS_SECRET_ACCESS_KEY,
            signatureVersion: 'v4'
		})

        const key = Date.now() + '-' + name

		const fileParams = {
			Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
			Key: key,
			Expires: 600,
			ContentType: type
		}

		const url = await s3.getSignedUrlPromise('putObject', fileParams)

		res.status(200).json({ url, key })

    }
};
