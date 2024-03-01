import mongoose, { Schema, Types } from 'mongoose';
typeof mongoose.SchemaTypes

// ATTN: Enum key and value should match
// template component name Pascal Cased.
export enum TemplatesEnum {
	PhotoList = 'PhotoList',
	VideoPlayer = 'VideoPlayer',
	HeadlineOnlyCTA = 'HeadlineOnlyCTA',
	TextBlock = 'TextBlock',
	PDFView = 'PDFView'
}

export enum AssetsEnum {
	Image = 'Image',
	Video = 'Video',
	Text = 'Text',
	PDF = 'PDF'
}

export enum TextAlignOptionsEnum {
	Left = 'left',
	Center = 'center',
	Right = 'right',
	None = ''
}

export type SubdocumentType = {
	type: Types.ObjectId;
	ref: string;
}

export const templatesEnumValueArr = Object.values(TemplatesEnum);
export const assetsEnumValueArr = Object.values(AssetsEnum);
export const textAlignOptionsEnumValueArr = Object.values(TextAlignOptionsEnum);
export const schemaNameOptionsEnumArr = ['Page', 'Templates', 'Assets'];
export type SchemaNameOptionsType = 'Page' | 'Templates' | 'Assets';

export type OptionsType = {
	// Can be multiple different kinds as per mongoose, handled by Typegoose ultimately
	required?: boolean;
	default?: boolean | string | number | Date;
	index?: boolean;
	enum?: typeof templatesEnumValueArr |
		typeof assetsEnumValueArr |
		typeof textAlignOptionsEnumValueArr |
		typeof schemaNameOptionsEnumArr;
	// For accessing enum array from object (deprecated)
	enumKey?: string;
	// Default value for the select input
	defaultValue?: string;
	formTitle?: string;
	// Hide this input from the form
	hide?: boolean;
	// Display a textarea input instead of regular text input in the form
	textbox?: boolean;
	// Use file input in the form
	file?: boolean;
	// For displaying a boolean toggle switch in the form
	select?: boolean;
	// For displaying a rich text editor in the form
	richText?: boolean;
	// For nested fields like "meta" in Page, dropdown button text in the form
	collapseTitle?: string;
	// Input is only for internal use, but could appear in the form and take input.
	// For example, if you have data that you want to use in a template, but not show
	// in the UI
	internal?: boolean;
	// For setting some data during user input, i.e. asset
	// in Assets file in assetKey, internal/background
	dataFormKey?: string;
	// For setting some preview url during user input, i.e. asset preview
	// in Assets file in assetKey, internal/background
	dataPreviewUrl?: string;
	// For setting some asset dimensions during user input,
	// i.e. asset dimensions in Assets file in assetKey, internal/background
	dimensionsKey?: string;
	// For setting some preview type during user input,
	// i.e. asset preview type key in Assets file in assetKey, internal/background
	previewTypeKey?: string;
	// For highlighting fields in use for a given template in blue,
	// i.e. this field is used in ImageGrid, include it as { 'ImageGrid': 1 }
	templates?: { [key in TemplatesEnum]?: 1; };
	// For limiting subdocument choices to just a single document in the form
	singleChoice?: boolean;
	// For showing filter types for ListField if needed/available
	filterType?: boolean;
	// For hiding available choices in ListField
	nested?: boolean;
}