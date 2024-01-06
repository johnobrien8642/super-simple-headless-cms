import { AssetsType } from "../../../models/Assets"
import { TemplatesType } from "../../../models/Templates"
import { PageType } from "../../../models/Page"

// export type AllDocItemType<T extends AssetsType | TemplatesType | PageType>
// = T extends AssetsType ? AssetsType :
// T extends TemplatesType ? TemplatesType :
// T extends PageType ? PageType : T;


// export type AllDocUnionType<T extends 'Assets' | 'Templates' | 'Page'> = T extends 'Assets' ? AssetsType : T extends 'Templates' ? TemplatesType : T extends 'Page' ? PageType : T;
export type AllDocUnionType = AssetsType | TemplatesType | PageType;
export type AllDocUnionTypeDyn<T extends 'Assets' | 'Templates' | 'Page'>
	= T extends 'Assets' ? AssetsType :
	T extends 'Templates' ? TemplatesType :
	T extends 'Page' ? PageType : T;
export type AllDocIntersectionType = AssetsType & TemplatesType & PageType;
export type AllDocType = { [key in keyof AllDocIntersectionType]: string; } & AllDocUnionType;
export type AllDocArrayUnionType = AssetsType[] | TemplatesType[] | PageType[];
export type AllDocArrayType = AllDocArrayUnionType;

export type AllDocTypeObj = {
	Assets: AssetsType;
	Templates: TemplatesType;
	Page: PageType;
}
