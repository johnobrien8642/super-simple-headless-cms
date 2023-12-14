import mongoose, { InferSchemaType, HydratedDocument, Types } from 'mongoose';
import { templateOptions } from '../template_options'
import { OptionsType, templatesEnumValueArr } from './model-types';
import { AssetsType } from './Assets';
const Schema = mongoose.Schema;

const optionsObj: { [key: string]: OptionsType } = {
	title: {
		templates: {
			'ImageTriptych': 1
		}
	},
	type: {
		required: true,
		enum: templatesEnumValueArr,
		formTitle: 'Template Type',
		select: true,
		enumKey: 'templateOptions'
	},
	showMobile: {
		default: true,
		formTitle: 'Show in Mobile'
	},
	description: {
		textbox: true,
		templates: {
			'ImageTriptych': 1
		}
	},
	richDescription: {
		richText: true,
		formTitle: 'Rich Text'
	},
	extLink: {
		formTitle: 'External Link'
	},
	assetsIds: {
		formTitle: 'Assets'
	},
	videoId: {
		formTitle: 'Exterior Asset To Link To',
		singleChoice: true,
		templates: {
			'ImageTriptych': 1
		}
	},
	schemaName: {
		default: 'Templates',
		hide: true,
		internal: true
	},
	isDuplicate: {
		default: false,
		hide: true,
		internal: true
	},
	updatedAt: {
		hide: true,
		internal: true
	},
	createdAt: {
		hide: true,
		internal: true
	}
}

const TemplatesSchema = new Schema({
	schemaName: {
		type: String,
		...optionsObj.schemaName
	},
	title: {
		type: String,
		...optionsObj.title
	},
	type: {
		type: String,
		...optionsObj.type
	},
	showMobile: {
		type: Boolean,
		...optionsObj.showMobile
	},
	description: {
		type: String,
		...optionsObj.description
	},
	richDescription: {
		type: String,
		...optionsObj.richDescription
	},
	extLink: {
		type: String,
		...optionsObj.extLink
	},
	assetsIds: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Assets'
			}
		],
		...optionsObj.assetsIds
	},
	videoId: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Assets'
			}
		],
		...optionsObj.videoId
	},
	isDuplicate: {
		type: Boolean,
		...optionsObj.isDuplicate
	},
	updatedAt: {
		type: Date,
		default: Date.now,
		...optionsObj.updatedAt
	},
	createdAt: {
		type: Date,
		default: Date.now,
		...optionsObj.createdAt
	}
});
export type TemplatesSubdocsType = {
	assetsIds: AssetsType[];
	videoId: AssetsType[];
}
export type TemplatesTypeNoSubDoc = Omit<InferSchemaType<typeof TemplatesSchema>, 'assetsIds' | 'videoId'>;
// export type TemplatesType = HydratedDocument<TemplatesTypeNoSubDoc & TemplatesSubdocsType>;
export type TemplatesType = TemplatesTypeNoSubDoc & TemplatesSubdocsType & { _id: string; typeName: 'Templates' };
export type HydratedTemplatesType = HydratedDocument<TemplatesType>;
const Templates =
	mongoose.models?.Templates || mongoose.model<TemplatesType>('Templates', TemplatesSchema, 'templates');

export default Templates;
