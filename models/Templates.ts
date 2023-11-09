import mongoose from 'mongoose';
import { templateOptions } from '../template_options'
const Schema = mongoose.Schema;

const TemplatesSchema = new Schema({
	title: {
		type: String
	},
	templateType: {
		type: String,
		enum: templateOptions,
		formTitle: 'Template Type',
		select: true
	},
	description: {
		type: String,
		textbox: true
	},
	assets: [
		{
			type: mongoose.Types.ObjectId,
			ref: 'Assets'
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

const Templates =
	mongoose.models.Templates || mongoose.model('Templates', TemplatesSchema, 'templates');

export default Templates;
