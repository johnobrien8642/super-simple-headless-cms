import React from 'react';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import Image from 'next/image';

const MyImage = ({ image, height, setPhotoHook, setOpenModalHook }) => {
	const desktop = useBreakpointValue(
		{
			base: false,
			md: true
		}
	)

	return <Box
		key={image._id}
		width='100%'
		height={height}
		my='auto'
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
		aspectRatio={{ md: '1 / .7' }}
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
			alt={image.title || 'alt text'}
			width={image.assetDimensions[0]}
			height={image.assetDimensions[1]}
			src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + image.assetKey}
		/>
	</Box>
}

export default MyImage;