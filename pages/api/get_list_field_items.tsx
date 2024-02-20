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
	const { schema, nestedItemIds, itemType, hideAvailableChoices } = req.query;
	const nestedItemIdsArr = nestedItemIds ? (nestedItemIds as string).split(',') : [];
	let availableItemsFilter: any = {
		_id: { $nin: nestedItemIdsArr }
	};
	if (itemType) {
		availableItemsFilter.type = itemType;
	}
	let availableItems;
	if (hideAvailableChoices !== 'true') {
		availableItems = await models[schema as string].find(availableItemsFilter)
	}
	const chosenItems = await models[schema as string].find({ _id: { $in: nestedItemIdsArr } })
	if (chosenItems) {
		const orderedChosenItems = new Array(chosenItems.length);
		let item;
		for (let i = 0; i < chosenItems.length; i++) {
			item = chosenItems[i];
			orderedChosenItems.splice(nestedItemIdsArr.indexOf(item._id.toString()), 1, item)
		}
		return res.status(200).json({ availableItems, chosenItems: orderedChosenItems });
	} else {
		return res.status(404).json({ error: 'That wasnt a valid model' });
	}
};