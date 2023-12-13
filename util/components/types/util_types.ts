import { AssetsType } from "../../../models/Assets"
import { TemplatesType } from "../../../models/Templates"
import { PageType } from "../../../models/Page"

export type AllDocType = AssetsType | TemplatesType | PageType;
export type AllDocArrayType = AssetsType[] | TemplatesType[] | PageType[];