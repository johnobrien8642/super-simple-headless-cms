import { NextApiRequest, NextApiResponse } from 'next';
import models from '../../lib/index';
export const config = {
	api: {
		bodyParser: {
			sizeLimit: '50mb',
		},
	},
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const { formTitle, id } = req.query;
	const child = await models[formTitle as string].findById(id);
	const parent = await models[formTitle as string].findOne({ childPagesIds: { $in: [child._id] } });
	return res.status(200).json({ parent });
};