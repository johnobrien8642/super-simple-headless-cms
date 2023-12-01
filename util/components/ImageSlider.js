import React from 'react';
import {
	Box,
	useBreakpointValue
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import Image from 'next/image';
import ImageInfo from './ImageInfo';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const ImageSlider = ({ images, height, padding, startingIndex }) => {
	const desktop = useBreakpointValue(
		{
			base: false,
			md: true
		}
	)

	return (
		<Box
			className='slide-container'
			width='100%'
			padding={padding}
			height={height}
			sx={{

				'.chakra-icon': {
					fontSize: '2rem'
				},
				'.disabled': {
					display: 'none'
				}
			}}
		>
			<Slide
				defaultIndex={startingIndex ?? 0}
				arrows={desktop}
				autoplay={false}
				infinite={false}
				slidesToShow={1}
				duration={100}
				transitionDuration={500}
				variabl
				prevArrow={
					<ChevronLeftIcon fontSize='5rem !important' left='-5rem !important' color='white' />
				}
				nextArrow={
					<ChevronRightIcon fontSize='5rem !important' right='-5rem !important' color='white' />
				}
			>
				{
					images.map(obj => {
						return <Box
							key={obj._id}
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
						>
							<Image
								alt={obj.title || 'alt text'}
								width={obj.assetDimensions[0]}
								height={obj.assetDimensions[1]}
								src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + obj.assetKey}
							/>
							<ImageInfo image={obj} />
						</Box>
					})
				}
			</Slide>
		</Box>
	)
}

export default ImageSlider;