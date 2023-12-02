import React, { useState } from 'react'
import {
	Box,
	Heading,
	Text,
	Flex,
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
import { DragHandleIcon } from '@chakra-ui/icons';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import Image from 'next/image';
import Link from 'next/link';
import { CiVideoOn } from "react-icons/ci";

const ImageTriptych = ({ template }) => {
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
							m='1rem'
						>
							<Box
								width='100%'
								sx={{
									':hover': {
										cursor: 'pointer'
									}
								}}
							>
								<Image
									alt={obj.title || 'alt text'}
									sizes='(min-width: 500px) 33vw, (min-width: 1200px) 66vw, 100vw'
									width={obj.assetDimensions[0]}
									height={obj.assetDimensions[1]}
									src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + obj.assetKey}
								/>
							</Box>
							<Heading as='h5'>{obj?.title}</Heading>
							<Text as='h5'>{obj?.description}</Text>
							<Text as='span' my='1rem' dangerouslySetInnerHTML={{ __html: obj?.richDescription }}></Text>
						</Box>
					})
				}
			</Slide>
		</Box>
	}

	return (
		<Box
			className='image-triptych'
			width={{ base: '100%', md: '90%' }}
			mx='auto'
			key={template._id}
		>
			<Flex
				flexDir='column'
				px='1rem'
			>
				{template.title &&
					<Heading as='h3'>
						{template.title}
					</Heading>
				}
				{template.description &&
					<Text fontSize='2rem'>
						{template.description}
					</Text>
				}
				{
					template.videoId.length &&
						<Link
							href={{
								pathname: '/video',
								query: { _id: template.videoId[0].assetKey }
							}}
						>
							<Text
								display='inline-flex'
								alignItems='center'
								py='.4rem'
								as='span'
								sx={{
									':hover': {
										color: 'lightgray'
									}
								}}
							>
								Click to View Original Movie <Box ml='.2rem'><CiVideoOn fontSize='1.4rem' /></Box>
							</Text>
						</Link>
				}
			</Flex>
			{
				!desktop &&
					<Flex>
						<DragHandleIcon ml='auto' mr='1rem' />
					</Flex>
			}
			{handleSlider(template, { base: 'block', md: 'none' })}
			<Flex>
				{
					template.assetsIds.map((obj, index) => {
						return <Box
							key={obj._id}
							m='1rem'
							display={{ base: 'none', md: 'block' }}
						>
							<Box
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
									sizes='(min-width: 500px) 33vw, (min-width: 700px) 66vw, (min-width: 1200px) 100vw'
									width={obj.assetDimensions[0]}
									height={obj.assetDimensions[1]}
									src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + obj.assetKey}
									onClick={() => {
										setImageModalOpen(true)
										setImageIndex(index)
									}}
								/>
							</Box>
							<Heading as='h5'>{obj?.title}</Heading>
							<Text as='h5'>{obj?.description}</Text>
							<Text as='span' my='1rem' dangerouslySetInnerHTML={{ __html: obj?.richDescription }}></Text>
						</Box>
					})
				}
			</Flex>
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

export default ImageTriptych;
