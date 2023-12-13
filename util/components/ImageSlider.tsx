import React from 'react';
import {
	Box,
	useBreakpointValue
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import MyImage from './Image'
import ImageInfo from './ImageInfo';
import { AssetsType } from '../../models/Assets';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';

const ImageSlider = ({
	images,
	height,
	padding,
	startingIndex
}: {
	images: AssetsType[];
	height: number;
	padding: number;
	startingIndex: number;
}) => {
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
				prevArrow={
					<ChevronLeftIcon fontSize='5rem !important' left='-5rem !important' color='white' />
				}
				nextArrow={
					<ChevronRightIcon fontSize='5rem !important' right='-5rem !important' color='white' />
				}
			>
				{
					images.map(obj => {
						return <>
							<MyImage image={obj} />
							<ImageInfo image={obj} />
						</>
					})
				}
			</Slide>
		</Box>
	)
}

export default ImageSlider;