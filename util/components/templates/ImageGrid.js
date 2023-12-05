import React, { useState, useEffect } from 'react'
import {
	Box,
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
import 'react-slideshow-image/dist/styles.css'
import Image from 'next/image';
import Masonry, {ResponsiveMasonry} from "react-responsive-masonry";
import ImageSlider from '../ImageSlider';


const ImageGrid = ({ template }) => {
	const [imageModalOpen, setImageModalOpen] = useState(false);
	const [imageIndex, setImageIndex] = useState(0);
	const [images, setImages] = useState([]);
	const desktop = useBreakpointValue(
		{
			base: false,
			md: true
		}
	)

	useEffect(() => {
		handleGetList();
		async function handleGetList() {
			const res = await fetch('/api/get_all_photo_list_assets',
			{
				method: 'GET',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json'
				}
			})
			const resData = await res.json();
			const { allImages } = resData;
			setImages(allImages);
		}
	}, [])
	return (
		<Box
		className='image-grid'
		width={{ base: '100%', md: '75%' }}
		mx='auto'
		mt={{ base: '1rem', md: '2rem' }}
		mb={{ base: '5rem', md: '12rem' }}
		key={template._id}
		>
			<ResponsiveMasonry
				columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
				>
				<Masonry>
					{
						images.map((obj, index) => {
							return <Box
								key={obj._id}
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
									priority={index < 5}
									sizes='60w, (min-width: 520px) 75vw, (min-width: 1200px) 90vw'
									alt={obj.title || 'alt text'}
									width={obj.assetDimensions[0]}
									height={obj.assetDimensions[1]}
									src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + obj.assetKey}
									onClick={() => {
										setImageModalOpen(true)
										setImageIndex(index)
									}}
									blurDataURL={Buffer.from(obj?.blurString).toString()}
									placeholder='blur'
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
					<ModalCloseButton />
					<ModalBody
						px={{ md: '5rem' }}
					>
						<ImageSlider
							images={images}
							startingIndex={imageIndex}
							padding={{ base: '2rem 0', md: '5rem 3rem'}}
						/>
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
