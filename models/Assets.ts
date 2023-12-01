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
		index: true,
		templates: {
			'Image Grid': 1,
			'Image Triptych': 1,
			'Photo List': 1,
			'Book Cover CTA': 1,
			'About': 1
		}
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
		index: true,
		templates: {

		}
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
		type: String,
		templates: {
			'Image Grid': 1,
			'Image Triptych': 1,
			'Photo List': 1,
			'Book Cover CTA': 1,
			'Headline Only CTA': 1,
			'Text Block': 1
		}
	},
	description: {
		type: String,
		textbox: true,
		formTitle: 'Regular Text',
		templates: {
			'Image Triptych': 1,
			'Book Cover CTA': 1,
			'About': 1
		}
	},
	textAlign: {
		type: String,
		enum: textAlignOptions,
		select: true,
		enumKey: 'textAlignOptions',
		formTitle: 'Rich Text and Title Align',
		defaultValue: 'left',
		templates: {
			'Text Block': 1
		}
	},
	richDescription: {
		type: String,
		richText: true,
		formTitle: 'Rich Text',
		templates: {
			'Image Grid': 1,
			'Image Triptych': 1,
			'Photo List': 1,
			'Book Cover CTA': 1,
			'Text Block': 1,
			'About': 1
		}
	},
	extLink: {
		type: String,
		formTitle: 'External Link',
		templates: {
			'Image Grid': 1,
			'Photo List': 1,
			'Book Cover CTA': 1
		}
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
		hide: true,
		internal: true
	},
	isDuplicate: {
		type: Boolean,
		default: false,
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

const Assets =
	mongoose.models.Assets || mongoose.model('Assets', AssetsSchema, 'assets');

export default Assets;