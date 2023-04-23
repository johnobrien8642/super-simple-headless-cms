import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const EssaySchema = new Schema({
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

const Essay =
	mongoose.models.Essay || mongoose.model('Essay', EssaySchema, 'demo-essays');

export default Essay;
