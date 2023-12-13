import React from 'react';
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
} from '@chakra-ui/react';
import MyImage from './Image';
import ImageSlider from './ImageSlider';
import ImageInfo from './ImageInfo';
import { AssetsType } from '../../models/Assets';


const ImageFocus = ({
	assets,
	imageIndexNum,
	setImageIndexHook,
	setOpenModalHook,
	openModalBool
}: {
	assets: AssetsType | AssetsType[];
	imageIndexNum: number;
	setImageIndexHook: React.Dispatch<React.SetStateAction<number>>;
	setOpenModalHook: React.Dispatch<React.SetStateAction<boolean>>;
	openModalBool: boolean;
}) => {
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
			>
				{
					Array.isArray(assets) &&
						<ImageSlider images={assets} startingIndex={imageIndexNum} />
				}
				{
					!Array.isArray(assets) &&
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