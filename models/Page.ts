import mongoose, { InferSchemaType, HydratedDocument, HydratedSingleSubdocument } from 'mongoose';
import { OptionsType } from './model-types';
import { TemplatesType } from './Templates';
const Schema = mongoose.Schema;

const optionsObj: { [key: string]: OptionsType } = {
	metaTitle: {
		formTitle: 'Meta Title'
	},
	metaDescription: {
		formTitle: 'Meta Description'
	},
	meta: {
		collapseTitle: 'Meta Info'
	},
	showInNavigation: {
		default: true,
		formTitle: 'Show in Navigation'
	},
	description: {
		textbox: true
	},
	templatesIds: {
		formTitle: 'Templates'
	},
	schemaName: {
		default: 'Page',
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

const MetaDropdownSchema = new Schema({
	metaTitle: {
		type: String,
		...optionsObj.metaTitle
	},
	metaDescription: {
		type: String,
		...optionsObj.metaDescription
	}
})

const PageSchema = new Schema({
	schemaName: {
		type: String,
		...optionsObj.schemaName
	},
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
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Templates'
			}
		],
		formTitle: 'Templates',
	},
	meta: {
		type: MetaDropdownSchema,
		...optionsObj.meta
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

export type MetaDropdownType = InferSchemaType<typeof MetaDropdownSchema>;
export type PageSubDocsType = {
	templatesIds: TemplatesType[];
	meta: MetaDropdownType;
}
export type PageNoSubdocsType = Omit<InferSchemaType<typeof PageSchema>, 'templatesIds' | 'meta'>;
// export type PageType = HydratedDocument<PageNoSubdocsType & PageSubDocsType>;
export type PageType = PageNoSubdocsType & PageSubDocsType & { _id: string; typeName: 'Page' };
export type HydratedPageType = HydratedDocument<PageType>;

const Page =
	mongoose.models?.Page || mongoose.model<PageType>('Page', PageSchema, 'pages');

export default Page;
