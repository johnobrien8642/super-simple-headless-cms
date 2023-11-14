import mongoose from 'mongoose';
import { assetTypes } from '../template_options';
const Schema = mongoose.Schema;

const AssetsSchema = new Schema({
	assetKey: {
		type: String,
		file: true,
		formTitle: 'Asset File',
		dataFormKey: 'assetFile'
	},
	thumbnailKey: {
		type: String,
		file: true,
		formTitle: 'Thumbnail File',
		dataFormKey: 'thumbnailFile'
	},
	blurString: {
		type: Buffer,
		hide: true
	},
	title: {
		type: String
	},
	description: {
		type: String,
		textbox: true
	},
	extLink: {
		type: String,
		formTitle: 'External Link'
	},
	type: {
		type: String,
		enum: assetTypes,
		required: true,
		select: true,
		enumKey: 'assetTypes'
	},
	schemaName: {
		type: String,
		default: 'Assets',
		hide: true
	},
	createdAt: {
		type: Date,
		default: Date.now,
		hide: true
	}
});

const Assets =
	mongoose.models.Assets || mongoose.model('Assets', AssetsSchema, 'assets');

export default Assets;