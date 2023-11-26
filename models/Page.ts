import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const metaDropdownSchema = new Schema({
	metaTitle: {
		type: String,
		formTitle: 'Meta Title'
	},
	metaDescription: {
		type: String,
		formTitle: 'Meta Description'
	}
})

const PageSchema = new Schema({
	title: {
		type: String
	},
	folderHref: {
		type: String,
		required: true,
		hide: true
	},
	showInNavigation: {
		type: Boolean,
		default: true,
		formTitle: 'Show in Navigation'
	},
	description: {
		type: String,
		textbox: true
	},
	templatesIds: {
		type: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Templates'
			}
		],
		formTitle: 'Templates',
	},
	meta: {
		type: metaDropdownSchema,
		collapseTitle: 'Meta Info'
	},
	schemaName: {
		type: String,
		default: 'Page',
		hide: true
	},
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
