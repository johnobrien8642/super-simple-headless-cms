import React, { useState } from 'react'
import {
	Grid,
	Flex,
	useBreakpointValue
} from '@chakra-ui/react';
import MyImage from '../Image';
import ImageFocus from '../ImageFocus';
import ImageInfo from '../ImageInfo';
import { AssetsType } from '../../../models/Assets';
import { TemplatesType } from '../../../models/Templates';

const PhotoList = ({ template }: { template: TemplatesType }) => {
	const [image, setImage] = useState<AssetsType | {}>({});
	const [openModal, setOpenModal] = useState(false);
	const asset = template.assetsIds[0];
	const desktop = useBreakpointValue(
		{
			base: false,
			md: true
		}
	)

	return <Flex
		flexDir='column'
		width='90%'
		m='5rem auto'
	>
		{
			template.assetsIds.map((asset, index) => {
				return <Grid
					key={asset._id}
					gridTemplateColumns={{ base: '100%', lg: '50% 1fr'}}
					gap={{ base: '0', md: '2%' }}
					width='100%'
					my={{ base: '1rem', md: '2rem' }}
					pt={{ base: '1rem', md: '2rem' }}
					px={{ base: '.5rem', md: '2rem' }}
					borderTop='1px solid white'
					alignItems='center'
				>
					<MyImage image={asset} setPhotoHook={setImage} setOpenModalHook={setOpenModal} priority={index < 2} />
					<ImageInfo image={asset} />
				</Grid>
			})
		}
		<ImageFocus assets={image} setOpenModalHook={setOpenModal} openModalBool={openModal} />
	</Flex>
}

export default PhotoList;