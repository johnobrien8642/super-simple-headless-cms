import mongoose from 'mongoose';
import { templateOptions } from '../template_options'
const Schema = mongoose.Schema;

const TemplatesSchema = new Schema({
	title: {
		type: String
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
		textbox: true
	},
	assetsIds: {
		type: [
			{
				type: mongoose.Types.ObjectId,
				ref: 'Assets'
			}
		],
		formTitle: 'Assets',
	},
	schemaName: {
		type: String,
		default: 'Templates',
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

const Templates =
	mongoose.models.Templates || mongoose.model('Templates', TemplatesSchema, 'templates');

export default Templates;
