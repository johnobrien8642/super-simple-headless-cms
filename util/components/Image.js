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
			sizes='60w, (min-width: 520px) 75vw, (min-width: 1200px) 90vw'
			alt={image.title || 'alt text'}
			width={image.assetDimensions[0]}
			height={image.assetDimensions[1]}
			src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + image.assetKey}
			blurDataURL={image?.blurString ? Buffer.from(image?.blurString).toString() : ''}
			placeholder='blur'
		/>
	</Box>
}

export default MyImage;