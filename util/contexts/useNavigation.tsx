import React, { useContext, createContext } from "react";
import { templateOptions, assetTypes } from "../../template_options";

export type NavigationDataType = {

}

export type AllModelNames = 'Page' | 'Templates' | 'Assets' | '';

export type NavigationDataContextType = {

};

export const dataInitialValue: NavigationDataType = {

}

export const NavigationDataContext = createContext<NavigationDataContextType>({

});

export function NavigationDataProvider({ children }: any) {
	return (
		<NavigationDataContext.Provider value={{}}>
			{children}
		</NavigationDataContext.Provider>
	);
}

export function useManagePageForm() {
	return useContext(NavigationDataContext);
}