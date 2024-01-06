import React from 'react'
import {
	Heading,
	Box,
	Grid,
	Flex,
	Button,
	Text
} from '@chakra-ui/react';
import Image from 'next/image';
import Link from 'next/link';
import { BasePropsType } from '../types/prop_types';

const BookCoverCTA = ({ template }: BasePropsType) => {
	const asset = template.assetsIds[0];
	return <Flex
		flexDir='column'
		width='90%'
		m='auto'
	>
		<Heading
			py='2rem'
			textAlign='center'
			borderTop='1px solid white'
			borderBottom='1px solid white'
			my='5rem'
			fontSize='min(5rem, 14vw)'
			whiteSpace='pre-wrap'
			wordBreak='break-word'
		>
			{asset.title?.toUpperCase()}
		</Heading>
		<Grid
			gridTemplateColumns={{ base: '1fr', lg: '1fr 1fr'}}
			gap={10}
		>
			<Box>
				<Image
					width={asset.assetDimensions[0]}
					height={asset.assetDimensions[1]}
					alt={asset.title ?? 'Book Cover CTA Image'}
					src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL as string + asset.assetKey}
				/>
			</Box>
			<Box>
				<Heading mb='2rem'>{asset.description}</Heading>
				<Link href={asset.extLink ?? ''} passHref={true}>
					<Button
						variant='outline'
						sx={{
							':hover': {
								backgroundColor: '#535353'
							}
						}}
					>
						Buy the book
					</Button>
				</Link>
				<Text
					as='span'
					display='inline-block'
					mt='2rem'
					dangerouslySetInnerHTML={{ __html: asset.richDescription ?? '' }}
				/>
			</Box>
		</Grid>
	</Flex>
}

export default BookCoverCTA;