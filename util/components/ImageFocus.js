import React, { useState } from 'react';
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
import MyImage from './Image';
import ImageSlider from './ImageSlider';
import ImageInfo from './ImageInfo';
import Link from 'next/link';


const ImageFocus = ({ assets, imageIndexNum, setImageIndexHook, setOpenModalHook, openModalBool }) => {
	const asset = typeof assets === 'array' ? assets[0] : assets;

	return <Modal
		isOpen={openModalBool}
		onClose={() => {
			setOpenModalHook(false)
			if (setImageIndexHook) {
				setImageIndexHook(0)
			}
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
				p='5rem 3rem'
				maxH='1100px'
			>
				{
					assets?.length > 1 &&
						<ImageSlider images={assets} startingIndex={imageIndexNum} />
				}
				{
					assets?.length === 1 || typeof assets === 'object' &&
						<>
							<MyImage image={asset} />
							<ImageInfo image={asset} />
						</>
				}
			</ModalBody>
			<ModalFooter>
				<Button

					mr={3}
					onClick={() => {
						setOpenModalHook(false)
						if (setImageIndexHook) {
							setImageIndexHook(0)
						}
					}}
				>
					Close
				</Button>
			</ModalFooter>
		</ModalContent>
	</Modal>
}

export default ImageFocus;