import React from 'react';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import Image from 'next/image';

const MyImage = ({ image, height, setPhotoHook, setOpenModalHook, padding, priority }) => {
	const desktop = useBreakpointValue(
		{
			base: false,
			md: true
		}
	)

	return <Box
		key={image._id}
		width='100%'
		maxW='825px'
		padding={padding}
		height={height}
		m='auto'
		sx={{
			':hover': {
				cursor: 'pointer'
			},
			img: {
				width: '100%',
				height: '100%',
				objectFit: 'contain'
			}
		}}
		alignContent='center'
		objectFit='contain'
		onClick={() => {
			if (desktop) {
				if (setPhotoHook) {
					setPhotoHook(image)
				}
				if (setOpenModalHook) {
					setOpenModalHook(true)
				}
			}
		}}
	>
		<Image
			priority={priority}
			sizes='(min-width: 500px) 33vw, (min-width: 1200px) 66vw, 100vw'
			alt={image.title || 'alt text'}
			width={image.assetDimensions[0]}
			height={image.assetDimensions[1]}
			src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + image.assetKey}
		/>
	</Box>
}

export default MyImage;