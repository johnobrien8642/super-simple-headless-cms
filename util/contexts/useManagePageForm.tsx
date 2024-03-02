import React, { useContext, createContext, Dispatch } from "react";
import { init } from "./util/context_util";

// top level await works, use for dynamic creation of
// context file
const models = ['Page', 'Templates', 'Assets']
export const {
	ManagePageFormDataTypeObj,
	initialValueObj,
	AllModelNamesTypeStr,
	editItemTraceObjType,
	editItemTraceObjInitObj,
} = await init(models)

export type ManagePageFormDataType = typeof ManagePageFormDataTypeObj;

export type AllModelNames = typeof AllModelNamesTypeStr;

export type FormSelectedType = {
	formTitle: AllModelNames;
	prevFormTitle: AllModelNames;
	formIndex: number;
	editItemTraceObj: typeof editItemTraceObjType;
	update: AllModelNames;
	loading: boolean;
	parentId: string;
	parentIdentStr: string;
	parentFieldTitle: string;
};

export type ManagePageFormContextType = {
	data: ManagePageFormDataType,
	setData: React.Dispatch<React.SetStateAction<ManagePageFormDataType>>;
	formCache: any,
	setFormCache: any,
	formSelected: FormSelectedType;
	setFormSelected: React.Dispatch<React.SetStateAction<FormSelectedType>>;
	topLevelModal: boolean;
	setTopLevelModal: React.Dispatch<React.SetStateAction<boolean>>;
};

export const dataInitialValue: ManagePageFormDataType = initialValueObj;

export const formSelectedInitObj: FormSelectedType = {
	formTitle: 'Page',
	prevFormTitle: '',
	editItemTraceObj: editItemTraceObjInitObj,
	formIndex: 0,
	update: '',
	loading: false,
	parentId: '',
	parentIdentStr: '',
	parentFieldTitle: ''
}

export const ManagePageFormContext = createContext<ManagePageFormContextType>({
	data: dataInitialValue,
	setData: () => {},
	formCache: {},
	setFormCache: () => {},
	formSelected: formSelectedInitObj,
	setFormSelected: () => {},
	topLevelModal: false,
	setTopLevelModal: () => {}
});

export function ManagePageFormProvider({ data, setData, formCache, setFormCache, formSelected, setFormSelected, topLevelModal, setTopLevelModal, children }: any) {
	return (
		<ManagePageFormContext.Provider value={{ data, setData, formCache, setFormCache, formSelected, setFormSelected, topLevelModal, setTopLevelModal }}>
			{children}
		</ManagePageFormContext.Provider>
	);
}

export function useManagePageForm() {
	return useContext(ManagePageFormContext);
}