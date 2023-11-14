import models from '../../lib/index';

export default async (req, res) => {
	const { schema, nestedItemIds } = req.body;
	const availableItems = await models[schema].find({ _id: { $nin: nestedItemIds ?? [] } })
	const chosenItems = await models[schema].find({ _id: { $in: nestedItemIds ?? [] } })
	if (availableItems && chosenItems) {
		res.status(200).json({ availableItems, chosenItems });
	} else {
		res.status(401).json({ error: 'That wasnt a valid model' });
	}
};