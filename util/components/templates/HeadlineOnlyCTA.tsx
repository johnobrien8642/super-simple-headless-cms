import React from 'react';
import { Text, Box, Heading } from '@chakra-ui/react';
import { BasePropsType } from '../types/prop_types';

const HeadlineOnlyCTA = ({ template }: BasePropsType) => {
	const asset = template.assetsIds[0];
	return (
		<Box
			width={{ base: '90%', md: '75%' }}
			m='auto'
			py={{ base: '1rem', md: '3.2rem' }}
			fontSize='1.2rem'
		>
			<Heading
				py={{ base: '1rem', md: '2rem' }}
				textAlign='center'
				borderTop='1px solid white'
				borderBottom='1px solid white'
				my={{ base: '1rem', md: '5rem' }}
				fontSize='min(5rem, 14vw)'
				whiteSpace='pre-wrap'
				wordBreak='break-word'
			>
				{asset.title?.toUpperCase()}
			</Heading>
		</Box>
	)
}

export default HeadlineOnlyCTA;