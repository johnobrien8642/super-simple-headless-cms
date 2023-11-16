import React, { useContext, createContext } from "react";
import { templateOptions, assetTypes } from "../../template_options";

export type ManagePageFormDataType = {
	'Page': {
		_id?: string;
		title: string;
		folderHref: string;
		description: string;
		templatesIds?: string[];
	};
	'Templates': {
		_id?: string;
		title: string;
		type: typeof templateOptions[number] | '',
		description: string;
		assetsIds?: string[];
		videoId: string[];
	};
	'Assets': {
		_id?: string;
		assetKey: string;
		assetFile: File | '';
		assetDataUrl: '';
		assetDimensions: [number, number] | [];
		assetPreviewType: '';
		thumbnailKey: string;
		thumbnailFile: File | '';
		thumbnailDataUrl: '';
		thumbnailDimensions: [number, number] | [];
		thumbnailPreviewType: '';
		blurString: string;
		title: string;
		description: string;
		richDescription: string;
		type: typeof assetTypes[number] | '';
	}
}

export type AllModelNames = 'Page' | 'Templates' | 'Assets' | '';

export type ManagePageFormContextType = {
	data: ManagePageFormDataType,
	setData: () => void;
	formSelected: {
		formTitle: AllModelNames;
		prevFormTitle: AllModelNames;
		formIndex: number;
		editItemTraceObj: { 'Page': string; 'Templates': string; 'Assets': string; };
		update: AllModelNames;
	};
	setFormSelected: () => void;
	topLevelModal: boolean;
	setTopLevelModal: () => void;
};

export const dataInitialValue: ManagePageFormDataType = {
	'Page': {
		title: '',
		description: '',
		folderHref: '',
		templatesIds: []
	},
	'Templates' :  {
		title: '',
		type: '',
		description: '',
		assetsIds: [],
		videoId: []
	},
	'Assets' : {
		assetKey: '',
		assetFile: '',
		assetDataUrl: '',
		assetDimensions: [],
		assetPreviewType: '',
		thumbnailKey: '',
		thumbnailFile: '',
		thumbnailDataUrl: '',
		thumbnailDimensions: [],
		thumbnailPreviewType: '',
		blurString: '',
		title: '',
		description: '',
		richDescription: '',
		type: ''
	}
}

export const ManagePageFormContext = createContext<ManagePageFormContextType>({
	data: dataInitialValue,
	setData: () => {},
	formSelected: {
			formTitle: 'Page',
			prevFormTitle: '',
			editItemTraceObj: { 'Page': '', 'Templates': '', 'Assets': '' },
			formIndex: 0,
			update: ''
		},
	setFormSelected: () => {},
	topLevelModal: false,
	setTopLevelModal: () => {}
});

export function ManagePageFormProvider({ data, setData, formSelected, setFormSelected, topLevelModal, setTopLevelModal, children }: any) {
	return (
		<ManagePageFormContext.Provider value={{ data, setData, formSelected, setFormSelected, topLevelModal, setTopLevelModal }}>
			{children}
		</ManagePageFormContext.Provider>
	);
}

export function useManagePageForm() {
	return useContext(ManagePageFormContext);
}