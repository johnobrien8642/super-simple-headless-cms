import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PieceSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	summary: {
		type: String
	},
	sections: [
		{
			type: mongoose.Types.ObjectId,
			ref: 'Section'
		}
	],
	finished: {
		type: Boolean,
		default: false
	},
	updatedAt: {
		type: Date,
		default: Date.now
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

const Piece =
	mongoose.models.Piece || mongoose.model('Piece', PieceSchema, 'demo-pieces');

export default Piece;
