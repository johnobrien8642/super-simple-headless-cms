import React, { useContext, createContext } from "react";
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

export type ManagePageFormContextType = {
	data: ManagePageFormDataType,
	setData: () => void;
	formSelected: {
		formTitle: AllModelNames;
		prevFormTitle: AllModelNames;
		formIndex: number;
		editItemTraceObj: typeof editItemTraceObjType;
		update: AllModelNames;
		loading: boolean;
	};
	setFormSelected: () => void;
	topLevelModal: boolean;
	setTopLevelModal: () => void;
};

export const dataInitialValue: ManagePageFormDataType = initialValueObj;

export const ManagePageFormContext = createContext<ManagePageFormContextType>({
	data: dataInitialValue,
	setData: () => {},
	formSelected: {
			formTitle: 'Page',
			prevFormTitle: '',
			editItemTraceObj: editItemTraceObjInitObj,
			formIndex: 0,
			update: '',
			loading: false
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