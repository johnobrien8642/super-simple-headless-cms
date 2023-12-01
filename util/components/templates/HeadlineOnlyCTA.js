import React from 'react';
import { Text, Box, Heading } from '@chakra-ui/react';

const HeadlineOnlyCTA = ({ template }) => {
	const asset = template.assetsIds[0];
	return (
		<Box
			width={{ base: '90%', md: '75%' }}
			m='auto'
			py='5rem'
			fontSize='1.2rem'
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
				{asset.title.toUpperCase()}
			</Heading>
		</Box>
	)
}

export default HeadlineOnlyCTA;