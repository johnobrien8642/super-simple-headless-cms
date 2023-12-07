import mongoose, { InferSchemaType } from 'mongoose';
import { OptionsType } from './model-types';
const Schema = mongoose.Schema;

const optionsObj: { [key: string]: OptionsType } = {
	title: {
		required: true
	},
	createdAt: {
		hide: true
	}
}

const PageManagerSchema = new Schema({
	title: {
		type: String,
		...optionsObj.title
	},
	pageIds: [
		{
			type: mongoose.Types.ObjectId,
			ref: 'Page'
		}
	],
	createdAt: {
		type: Date,
		default: Date.now,
		...optionsObj.createdAt
	}
});

export type PageManagerType = InferSchemaType<typeof PageManagerSchema>;

const PageManager =
	mongoose.models.PageManager || mongoose.model('PageManager', PageManagerSchema, 'page-managers');

export default PageManager;
