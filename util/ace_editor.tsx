import AceEditor from "react-ace";
import {
	Box
} from '@chakra-ui/react'

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/ext-language_tools";

//@ts-ignore
const Editor = (props) => {
  return (
	<Box>
		<Box id="example"></Box>
		<AceEditor
			mode="javascript"
			theme="dracula"
			editorProps={{ $blockScrolling: true }}
			onChange={(e) => props.setCodeString(e)}
			{...props}
		/>
	</Box>
)
};

export default Editor;