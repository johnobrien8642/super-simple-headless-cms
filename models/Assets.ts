import mongoose from 'mongoose';
import { assetTypes, textAlignOptions } from '../template_options';
const Schema = mongoose.Schema;

const AssetsSchema = new Schema({
	assetKey: {
		type: String,
		file: true,
		formTitle: 'Asset File',
		dataFormKey: 'assetFile',
		dataPreviewUrl: 'assetDataUrl',
		dimensionsKey: 'assetDimensions',
		previewTypeKey: 'assetPreviewType',
		index: true
	},
	assetDimensions: {
		type: [Number, Number],
		hide: true
	},
	thumbnailKey: {
		type: String,
		file: true,
		formTitle: 'Thumbnail File',
		dataFormKey: 'thumbnailFile',
		dataPreviewUrl: 'thumbnailDataUrl',
		dimensionsKey: 'thumbnailDimensions',
		previewTypeKey: 'thumbnailPreviewType',
		index: true
	},
	thumbnailDimensions: {
		type: [Number, Number],
		hide: true
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
		textbox: true,
		formTitle: 'Regular Text'
	},
	textAlign: {
		type: String,
		enum: textAlignOptions,
		select: true,
		enumKey: 'textAlignOptions',
		formTitle: 'Rich Text and Title Align'
	},
	richDescription: {
		type: String,
		richText: true,
		formTitle: 'Rich Text'
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
	isDuplicate: {
		type: Boolean,
		default: false,
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