import mongoose from 'mongoose';
import { assetTypes } from '../template_options';
const Schema = mongoose.Schema;

const AssetsSchema = new Schema({
	assetLink: {
		type: String,
		required: true,
		file: true,
		formTitle: 'Asset File'
	},
	thumbnailLink: {
		type: String,
		file: true,
		formTitle: 'Thumbnail File'
	},
	blurString: {
		type: Buffer,
		required: true,
		hide: true
	},
	title: {
		type: String
	},
	description: {
		type: String
	},
	type: {
		type: String,
		enum: assetTypes,
		required: true
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