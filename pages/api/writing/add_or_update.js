import connectDb from '../../../lib/mongodb';
import Piece from '../../../models/Piece';
import Essay from '../../../models/Essay';
import Section from '../../../models/Section';

export default async (req, res) => {
	await connectDb();
	let piece;
	let section;
	let Model;
	const Models = {
		piece: Piece,
		essay: Essay
	};

	if (req.method === 'POST') {
		const {
			deleteBool,
			_id,
			update,
			titleHook,
			summaryHook,
			finishedHook,
			type
		} = req.body;
		Model = Models[type];

		try {
			if (deleteBool) {
				piece = await Model.findById(_id).populate('sections');
				await Model.deleteOne({ _id: piece._id });

				for (let i = 0; i < piece.sections.length; i++) {
					section = piece.sections[i];
					await Section.deleteOne({ _id: section._id });
				}
			} else {
				if (update === 'true') {
					piece = await Model.findById(_id);

					piece.title = titleHook;
					piece.summary = summaryHook;
					piece.finished = finishedHook;

					await piece.save();
				} else {
					piece = new Model({
						title: titleHook,
						summary: summaryHook
					});
					if (finishedHook) {
						piece.finished = finishedHook;
					}
					await piece.save();
				}
			}
			res.status(200).json({ success: true, piece });
		} catch (err) {
			res.status(500).json({ success: false, errorMessage: err.message });
		}
	}
};
