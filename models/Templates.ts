import mongoose from 'mongoose';
import { templateOptions } from '../template_options'
const Schema = mongoose.Schema;

const TemplatesSchema = new Schema({
	title: {
		type: String,
		templates: {
			'Image Triptych': 1
		}
	},
	type: {
		type: String,
		enum: templateOptions,
		required: true,
		formTitle: 'Template Type',
		select: true,
		enumKey: 'templateOptions'
	},
	description: {
		type: String,
		textbox: true,
		templates: {
			'Image Triptych': 1
		}
	},
	richDescription: {
		type: String,
		richText: true,
		formTitle: 'Rich Text',
		templates: {

		}
	},
	extLink: {
		type: String,
		formTitle: 'External Link',
		templates: {

		}
	},
	assetsIds: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Assets'
			}
		],
		formTitle: 'Assets'
	},
	videoId: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Assets'
			}
		],
		formTitle: 'Exterior Asset To Link To',
		singleChoice: true,
		templates: {
			'Image Triptych': 1
		}
	},
	schemaName: {
		type: String,
		default: 'Templates',
		hide: true,
		internal: true
	},
	isDuplicate: {
		type: Boolean,
		default: false,
		hide: true,
		internal: true
	},
	updatedAt: {
		type: Date,
		default: Date.now,
		hide: true,
		internal: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
		hide: true,
		internal: true
	}
});

const Templates =
	mongoose.models?.Templates || mongoose.model('Templates', TemplatesSchema, 'templates');

export default Templates;
