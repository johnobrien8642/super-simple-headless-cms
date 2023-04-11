import bcrypt from 'bcryptjs';
import dbConnect from '../../lib/mongodb.js';
import Admin from '../../models/Admin';

export default async (req, res) => {
	const { body, method } = req;
	await dbConnect();

	if (method === 'POST') {
		try {
			const admin = await Admin.create({
				username: body.username,
				password: await bcrypt.hash(body.password, 10)
			});

			res.status(200).json({ success: true, data: admin });
		} catch (err) {
			res.status(400).json({ success: false });
		}
	}
};
