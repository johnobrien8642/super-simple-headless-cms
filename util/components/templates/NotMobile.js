import { Center } from '@chakra-ui/react';
import React from 'react';

const NotMobile = ({ template }) => {
	const asset = template.assetsIds[0];
	return (
		<Center my={{ base: '2rem', md: '5rem' }}>
			<Text fontSize='1.5rem'>{asset.</Text>
		</Center>
	)
}

export default NotMobile;