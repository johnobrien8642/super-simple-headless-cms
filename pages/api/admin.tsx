import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dbConnect from '../../lib/mongodb.js';
import Admin from '../../models/Admin'
import { NextApiRequest, NextApiResponse } from 'next';
export const config = {
	api: {
		bodyParser: {
			sizeLimit: '50mb',
		},
	},
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	await dbConnect();
	const { body, method } = req;

	if (method === 'POST') {
		try {
			const admin = await Admin.create({
				username: body.username,
				password: await bcrypt.hash(body.password, 10)
			});
			const token = jwt.sign({ id: admin._id }, process.env.NEXT_PUBLIC_SECRET_KEY as string);
			return res.status(200).json({ success: true, data: { admin, token } });
		} catch (err) {
			console.log(err)
			return res.status(400).json({ error: `Error on admin create: ${err}` });
		}
	}
};
