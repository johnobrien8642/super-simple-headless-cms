import models from '../../lib/index';

export default async (req, res) => {
	const { schema } = req.body;
	if (models[schema]) {
		return res.status(200).json({ schemaPaths: models[schema].schema.paths });
	} else {
		return res.status(401).json({ error: 'That wasnt a valid model' });
	}
};