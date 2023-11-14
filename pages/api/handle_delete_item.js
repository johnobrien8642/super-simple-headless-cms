import models from '../../lib/index';

export default async (req, res) => {
	const { item } = req.body;
	try {
		const deleteRes = await models[item.schemaName].deleteOne({ _id: item._id })
		res.status(200).json({ deleteRes });
	} catch (err) {
		console.log(err)
		res.status(500).json({ error: err.message });
	}
};