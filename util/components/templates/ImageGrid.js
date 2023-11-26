import React, { useState } from 'react'
import {
	Box,
	Heading,
	Text,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	useBreakpointValue
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, DragHandleIcon } from '@chakra-ui/icons';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import Image from 'next/image';
import Link from 'next/link';
import { CiVideoOn } from "react-icons/ci";
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";

const ImageGrid = ({ template }) => {
	const [imageModalOpen, setImageModalOpen] = useState(false);
	const [imageIndex, setImageIndex] = useState(0);
	const desktop = useBreakpointValue(
		{
			base: false,
			md: true
		}
	)

	function handleSlider(template, displayObj, index) {
		return <Box
			className='slide-container'
			width='100%'
			py='2rem'
			display={displayObj}
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
				defaultIndex={index}
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
					template.assetsIds.map(obj => {
						return <Box
							key={obj._id}
							width='100%'
							height='700px'
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
						</Box>
					})
				}
			</Slide>
		</Box>
	}

	return (
		<Box
			className='image-grid'
			width={{ base: '100%', md: '90%' }}
			mx='auto'
			key={template._id}
		>
			<ResponsiveMasonry
				columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
			>
				<Masonry>
					{
						template.assetsIds.map((obj, index) => {
							return <Box
								key={obj._id}
								display={{ base: 'none', md: 'block' }}
								width='100%'
								transition='transform .2s'
								sx={{
									':hover': {
										cursor: 'pointer',
										transform: 'scale(1.02)'
									}
								}}
							>
								<Image
									alt={obj.title || 'alt text'}
									width={obj.assetDimensions[0]}
									height={obj.assetDimensions[1]}
									src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + obj.assetKey}
									onClick={() => {
										setImageModalOpen(true)
										setImageIndex(index)
									}}
								/>
							</Box>
						})
					}
				</Masonry>
			</ResponsiveMasonry>
			<Modal
				isOpen={imageModalOpen}
				onClose={() => {
					setImageModalOpen(false)
					setImageIndex(0)
				}}
			>
				<ModalOverlay />
				<ModalContent
					maxW='1200px'
					my='auto'
					backgroundColor='black'
					borderColor='transparent'
				>
					<ModalCloseButton/>
					<ModalBody
						px='5rem'
					>
						{
							handleSlider(template, {}, imageIndex)
						}
					</ModalBody>
					<ModalFooter>
						<Button

							mr={3}
							onClick={() => {
								setImageModalOpen(false)
								setImageIndex(0)
							}}
						>
							Close
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</Box>
	)
}

export default ImageGrid;
