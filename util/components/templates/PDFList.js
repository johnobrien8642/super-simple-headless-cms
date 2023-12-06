import React from 'react';
import Assets from '../../../models/Assets';
import { Box, Button } from '@chakra-ui/react';

const PDFList = ({ template }) => {
	return (
		<>
			{
				template.assetsIds?.map(asset => {
					const reform = new Assets(asset);
					return <Box key={asset._id}>
						Working
						<Button
							onClick={() => {
								const src = reform.base64String.toString();
								const downloadLink = document.createElement('a');
								const fileName = asset.title ? asset.title : 'johneobrien.pdf';
								downloadLink.href = src;
								downloadLink.download = fileName;
								downloadLink.click();
							}}
						>
							Download PDF
						</Button>
						<embed src={reform.base64String.toString()}/>
					</Box>
				})
			}
		</>
	)
}

export default PDFList;