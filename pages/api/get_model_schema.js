import models from '../../lib/index';

export default async (req, res) => {
	const { schema } = req.body;

	if (models[schema]) {
		res.status(200).json({ schemaPaths: models[schema].schema.paths });
	} else {
		res.status(401).json({ error: 'That wasnt a valid model' });
	}
};