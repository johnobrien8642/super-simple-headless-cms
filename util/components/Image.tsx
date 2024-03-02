import React, { SetStateAction } from 'react';
import { Box, useBreakpointValue } from '@chakra-ui/react';
import Image from 'next/image';
import { AssetsType } from '../../models/Assets';

const MyImage = ({
	image,
	height,
	setPhotoHook,
	setOpenModalHook,
	padding,
	priority
}: {
	image: AssetsType;
	height?: number;
	setPhotoHook?: React.Dispatch<React.SetStateAction<AssetsType | undefined>>;
	setOpenModalHook?: React.Dispatch<React.SetStateAction<boolean>>;
	padding?: number;
	priority?: boolean;
}) => {
	const desktop = useBreakpointValue(
		{
			base: false,
			md: true
		}
	)

	return <Box
		key={image._id.toString()}
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
			sizes='30w, (min-width: 520px) 65vw, (min-width: 1200px) 90vw'
			alt={image.title || 'alt text'}
			width={image.assetDimensions[0]}
			height={image.assetDimensions[1]}
			src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL as string + image.assetKey}
		/>
	</Box>
}

export default MyImage;