import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PageManagerSchema = new Schema({
	title: {
		type: String,
		required: true
	},
	pageIds: [
		{
			type: mongoose.Types.ObjectId,
			ref: 'Page'
		}
	],
	createdAt: {
		type: Date,
		default: Date.now,
		hide: true
	}
});

const PageManager =
	mongoose.models.PageManager || mongoose.model('PageManager', PageManagerSchema, 'page-managers');

export default PageManager;
