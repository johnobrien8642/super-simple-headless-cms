import React from "react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { cloneDeep } from "lodash";

const Editor = ({
	data,
	setData,
	formTitle,
	title
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