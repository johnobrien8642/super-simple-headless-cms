import bcrypt from 'bcryptjs';
import dbConnect from '../../lib/mongodb.js';
import Admin from '../../models/Admin';
import jwt from 'jsonwebtoken';

export default async (req, res) => {
	await dbConnect();

	const admin = await Admin.findOne({
		username: req.body.username
	});

	let authenticated;

	if (admin) {
		authenticated = await bcrypt.compare(
			req?.body?.password,
			admin?.password
		);
	}

	if (admin && authenticated) {
		const token = jwt.sign({ id: admin._id }, process.env.NEXT_PUBLIC_SECRET_KEY);
		res.status(200).json({ token: token });
	} else {
		res.status(401).json({ error: 'Username or password incorrect' });
	}
};
