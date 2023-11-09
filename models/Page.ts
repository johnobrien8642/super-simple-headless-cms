import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const PageSchema = new Schema({
	title: {
		type: String,
		required: true,
		textbox: false
	},
	description: {
		type: String,
		textbox: true
	},
	templates: [
		{
			type: mongoose.Types.ObjectId,
			ref: 'Templates'
		}
	],
	updatedAt: {
		type: Date,
		default: Date.now,
		hide: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
		hide: true
	}
});

const Page =
	mongoose.models.Page || mongoose.model('Page', PageSchema, 'pages');

export default Page;
