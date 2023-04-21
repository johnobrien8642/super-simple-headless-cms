import connectDb from '../../lib/mongodb.js';
import Post from '../../models/Post';
import aws from 'aws-sdk';

export default async (req, res) => {
	await connectDb();
	const s3 = new aws.S3();
	const SESConfig = {
		apiVersion: '2010-12-01',
		accessKeyId: process.env.NEXT_PUBLIC_MY_AWS_ACCESS_KEY,
		secretAccessKey: process.env.NEXT_PUBLIC_MY_AWS_SECRET_ACCESS_KEY,
		region: 'us-east-1'
	};
	s3.config.update(SESConfig);
	if (req.method === 'DELETE') {
		const { post } = req.body;
		const url = new URL(post.link);
		const params = {
			Bucket: 'jeob-personal-site',
			Key: url.pathname.replace('/', '')
		};
		try {
			await s3.deleteObject(params, function (err, data) {
				if (err) console.log(err, err.stack);
			});
			await Post.deleteOne({ _id: post._id });
			res.status(200).json({ success: true });
		} catch (err) {
			res.status(500).json({ success: false, errorMessage: err.message });
		}
	}
};
