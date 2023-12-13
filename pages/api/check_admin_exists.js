import connectDb from '../../lib/mongodb.js';
import Admin from '../../models/Admin';
export const config = {
	api: {
		bodyParser: {
			sizeLimit: '50mb',
		},
	},
}

export default async (req, res) => {
	await connectDb();
	try {
		const admin = await Admin.find({});
		return res.status(200).json({ admin: !!admin?.length });
	} catch (err) {
		return res.status(500).json({ error: `check_admin_exists failed: ${err}` });
	}
};