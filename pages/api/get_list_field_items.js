import models from '../../lib/index';

export default async (req, res) => {
	const { schema, nestedItemIds, itemType } = req.body;
	console.log(nestedItemIds)
	const availableItems = await models[schema].find({ _id: { $nin: nestedItemIds ?? [] }, type: itemType })
	const chosenItems = await models[schema].find({ _id: { $in: nestedItemIds ?? [] } })
	if (availableItems && chosenItems) {
		const orderedChosenItems = new Array(chosenItems.length);
		let item;
		for (let i = 0; i < chosenItems.length; i++) {
			item = chosenItems[i];
			orderedChosenItems.splice(nestedItemIds.indexOf(item._id.toString()), 1, item)
		}
		return res.status(200).json({ availableItems, chosenItems: orderedChosenItems });
	} else {
		return res.status(401).json({ error: 'That wasnt a valid model' });
	}
};