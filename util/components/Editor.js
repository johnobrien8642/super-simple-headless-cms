import React from "react";
import { cloneDeep } from "lodash";
import dynamic from 'next/dynamic';
const ClassicEditor = dynamic(() => import("@ckeditor/ckeditor5-build-classic"), { ssr: false })
const CKEditor = dynamic(() =>
	import("@ckeditor/ckeditor5-build-classic").then(mod => mod.CKEditor),
	{ ssr: false }
)

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