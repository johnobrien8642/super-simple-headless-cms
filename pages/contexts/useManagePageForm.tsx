import React, { useContext, createContext } from "react";
import { templateOptions, assetTypes } from "../../template_options";

export type ManagePageFormContextType = {
	pageFormData: {
		_id?: string;
		title: string;
		description: string;
		templates: [
			{
				_id?: string;
				title: string;
				templateType: typeof templateOptions[number] | '',
				description: string;
				assets: [
					{
						_id?: string;
						assetLink: string;
						thumbnailLink: string;
						blurString: string;
						title: string;
						description: string;
						type: typeof assetTypes[number] | '';
					}
				] | []
			}
		] | []
	};
	setPageFormData: () => void;
	formSelected: { formFlow: string[]; formIndex: number; };
	setFormSelected: () => void;
	openModal: boolean;
	setOpenModal: () => void;
};

export const ManagePageFormContext = createContext<ManagePageFormContextType>({
	pageFormData: {
		title: '',
		description: '',
		templates: []
	},
	setPageFormData: () => {},
	formSelected: { formFlow: ['Page'], formIndex: 0 },
	setFormSelected: () => {},
	openModal: false,
	setOpenModal: () => {}
});

export function ManagePageFormProvider({ pageFormData, setPageFormData, formSelected, setFormSelected, openModal, setOpenModal, children }: any) {
	return (
		<ManagePageFormContext.Provider value={{ pageFormData, setPageFormData, formSelected, setFormSelected, openModal, setOpenModal }}>
			{children}
		</ManagePageFormContext.Provider>
	);
}

export function useManagePageForm() {
	return useContext(ManagePageFormContext);
}