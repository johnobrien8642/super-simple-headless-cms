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
	folderHref: {
		required: true,
		hide: true
	},
	showInNavigation: {
		default: true,
		formTitle: 'Show in Navigation'
	},
	description: {
		textbox: true
	},
	childPagesIds: {
		formTitle: 'Child Pages',
		filterType: true,
		nested: true
	},
	templatesIds: {
		formTitle: 'Templates',
		filterType: true
	},
	schemaName: {
		default: 'Page',
		hide: true,
		internal: true,
		required: true,
		enum: ['Page']
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
	title: {
		type: String
	},
	folderHref: {
		type: String,
		...optionsObj.folderHref
	},
	showInNavigation: {
		type: Boolean,
		...optionsObj.showInNavigation
	},
	description: {
		type: String,
		...optionsObj.description
	},
	childPagesIds: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Page'
			}
		],
		...optionsObj.childPagesIds
	},
	templatesIds: {
		type: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'Templates'
			}
		],
		...optionsObj.templatesIds
	},
	meta: {
		type: MetaDropdownSchema,
		...optionsObj.meta
	},
	schemaName: {
		type: String,
		...optionsObj.schemaName
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

function autoPopulatePages(next: any) {
	//@ts-expect-error
	this.populate('childPagesIds');
	next()
}

PageSchema
	.pre('findOne', autoPopulatePages)
	.pre('find', autoPopulatePages)



export type MetaDropdownType = InferSchemaType<typeof MetaDropdownSchema>;
export type PageSubDocsType = {
	childPagesIds: PageType[];
	templatesIds: TemplatesType[];
	meta: MetaDropdownType;
}
export type PageNoSubdocsType = Omit<InferSchemaType<typeof PageSchema>, 'templatesIds' | 'childPagesIds' | 'meta'>;
// export type PageType = HydratedDocument<PageNoSubdocsType & PageSubDocsType>;
export type PageType = PageNoSubdocsType & PageSubDocsType & { _id: string; typeName: 'Page' };
export type HydratedPageType = HydratedDocument<PageType>;

const Page =
	mongoose.models?.Page || mongoose.model<PageType>('Page', PageSchema, 'pages');

export default Page;
