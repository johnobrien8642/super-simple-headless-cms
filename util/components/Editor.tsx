import React from "react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { cloneDeep } from "lodash";
import { ManagePageFormDataType } from "../contexts/useManagePageForm";

const Editor = ({
	data,
	setData,
	formTitle,
	title
}: {
	data: string,
	setData: React.Dispatch<React.SetStateAction<ManagePageFormDataType>>,
	formTitle: string,
	title: string
}) => {
	return (
		<CKEditor
			editor={ClassicEditor}
			data={data}
			onChange={(event, editor) => {
				const data = editor.getData();
				setData(prev => {
					const newData = cloneDeep(prev);
					newData[formTitle][title] = data;
					return newData;
				})
			}}
		/>
	);
};

export default Editor;