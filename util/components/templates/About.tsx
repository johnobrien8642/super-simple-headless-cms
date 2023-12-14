import React from 'react'
import {
	Heading,
	Box,
	Grid,
	Text
} from '@chakra-ui/react';
import Image from 'next/image';
import { BasePropsType } from '../types/prop_types';

const About = ({ template }: BasePropsType) => {
	const asset = template.assetsIds[0];
	return <Box
		py={{ base: '1rem', lg: '4.2rem'}}
		width={{ base: '90%', lg: '75%'}}
		m={{ base: '2rem auto', lg: '5rem auto'}}
		borderTop='1px solid white'
	>
		<Grid
			gridTemplateColumns={{ base: '1fr', lg: '1fr .5fr'}}
			gap='5rem'
			p='1rem'
		>
			<Box
				pl={{ base: '0', lg: '2rem' }}
				order={{ base: '1', lg: '0'}}
				textAlign={{ base: 'center', lg: 'left'}}
			>
				<Heading mb={{ base: '0', lg: '2rem'}}>{asset.description}</Heading>
				<Text
					as='span'
					display='inline-block'
					mt='2rem'
					lineHeight='2rem'
					dangerouslySetInnerHTML={{ __html: asset.richDescription ?? '' }}
				/>
			</Box>
			<Box
				borderRadius='42%'
				overflow='hidden'
				m='auto'
				w='100%'
				minWidth='300px'
				maxWidth='400px'
				order={{ base: '0', lg: '1'}}
				// mt={{ base: '2rem' }}
			>
				<Image
					objectFit='contain'
					width={asset.assetDimensions[0]}
					height={asset.assetDimensions[1]}
					alt={asset.title ?? 'About Image'}
					src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL as string + asset.assetKey}
				/>
			</Box>
		</Grid>
	</Box>
}

export default About;