import models from '../../lib/index';
export const config = {
	api: {
		bodyParser: {
			sizeLimit: '50mb',
		},
	},
}

export default async (req, res) => {
	const { formTitle } = req.query;
	if (models[formTitle]) {
		return res.status(200).json({ schemaPaths: models[formTitle].schema.paths });
	} else {
		return res.status(401).json({ error: 'That wasnt a valid model' });
	}
};