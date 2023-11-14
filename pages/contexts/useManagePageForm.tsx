import React, { useContext, createContext } from "react";
import { templateOptions, assetTypes } from "../../template_options";

export type ManagePageFormDataType = {
	'Page': {
		_id?: string;
		title: string;
		description: string;
		templatesIds?: string[];
	};
	'Templates': {
		_id?: string;
		title: string;
		templateType: typeof templateOptions[number] | '',
		description: string;
		assetsIds?: string[];
	};
	'Assets': {
		_id?: string;
		assetKey: string;
		assetFile: File | '';
		thumbnailKey: string;
		thumbnailFile: File | '';
		blurString: string;
		title: string;
		description: string;
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
		templatesIds: []
	},
	'Templates' :  {
		title: '',
		templateType: '',
		description: '',
		assetsIds: []
	},
	'Assets' : {
		assetKey: '',
		assetFile: '',
		thumbnailKey: '',
		thumbnailFile: '',
		blurString: '',
		title: '',
		description: '',
		type: ''
	}
}

export const ManagePageFormContext = createContext<ManagePageFormContextType>({
	data: dataInitialValue,
	setData: () => {},
	formSelected: { formTitle: 'Page', prevFormTitle: '', formIndex: 0, update: '' },
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