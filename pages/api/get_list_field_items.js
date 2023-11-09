import models from '../../lib/index';

export default async (req, res) => {
	const { schema } = req.body;
	const items = await models[schema].find()
	if (items) {
		res.status(200).json({ items });
	} else {
		res.status(401).json({ error: 'That wasnt a valid model' });
	}
};