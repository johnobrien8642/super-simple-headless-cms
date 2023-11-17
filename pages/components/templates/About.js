import React from 'react'
import {
	Heading,
	Box,
	Grid,
	GridItem,
	Flex,
	Button,
	Text
} from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';

const About = ({ template }) => {
	const asset = template.assetsIds[0];
	return <Box
		py='8rem'
		width='80%'
		m='auto'
		borderTop='1px solid white'
	>
		<Grid
			gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr'}}
			gap={10}
		>
			<Box>
				<Heading mb='2rem'>{asset.description}</Heading>
				<Text
					as='span'
					display='inline-block'
					mt='2rem'
					dangerouslySetInnerHTML={{ __html: asset.richDescription }}
				/>
			</Box>
			<Box
				borderRadius='42%'
				overflow='hidden'
			>
				<Image
					objectFit='contain'
					width={asset.assetDimensions[0]}
					height={asset.assetDimensions[1]}
					alt={asset.title}
					src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL + asset.assetKey}
				/>
			</Box>
		</Grid>
	</Box>
}

export default About;