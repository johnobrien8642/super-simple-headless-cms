import React, { useState } from 'react'
import {
	Heading,
	Box,
	Grid,
	GridItem,
	Flex,
	Button,
	Text,
	useBreakpointValue
} from '@chakra-ui/react';
import { DragHandleIcon } from '@chakra-ui/icons';
import Link from 'next/link';
import ImageSlider from '../ImageSlider';
import MyImage from '../Image';
import ImageFocus from '../ImageFocus';

const PhotoList = ({ template }) => {
	const [image, setImage] = useState({});
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
			template.assetsIds.map(asset => {
				return <Grid
					key={asset._id}
					gridTemplateColumns={{ base: '100%', lg: '50% 1fr'}}
					gap={{ base: '0', md: '5%' }}
					width='100%'
					my={{ base: '1rem', md: '2rem' }}
					pt={{ base: '1rem', md: '2rem' }}
					borderTop='1px solid white'
				>
					<MyImage image={asset} setPhotoHook={setImage} setOpenModalHook={setOpenModal} />
					<Box
						py={{ base: '0', md: '3rem' }}
						my={{ base: '.5rem', md: '0' }}
					>
						<Heading mb={{ base: '1rem', md: '2rem' }}>{asset.title}</Heading>
						{
							asset.extLink &&
								<Link
									my='1rem'
									href={asset.extLink ?? ''}
									passHref={true}
								>
									<Button
										variant='outline'
										sx={{
											':hover': {
												backgroundColor: '#535353'
											}
										}}
									>
										Buy it now
									</Button>
								</Link>
						}
						<Text
							as='span'
							display='inline-block'
							dangerouslySetInnerHTML={{ __html: asset.richDescription }}
						/>
					</Box>
				</Grid>
			})
		}
		<ImageFocus assets={image} setOpenModalHook={setOpenModal} openModalBool={openModal} />
	</Flex>
}

export default PhotoList;