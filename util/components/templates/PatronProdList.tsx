import React from 'react';
import { Box, Flex, Text, Heading } from '@chakra-ui/react';
import { TemplatesType } from '../../../models/Templates';
import { AssetsType } from '../../../models/Assets';

const PatronProdList = ({ template }: { template: TemplatesType}) => {
	return (
		<Flex
			direction='column'
			width={{ base: '100%', md: '90%'}}
		>
			{template.assetsIds.map((asset: AssetsType) => {
					return <Box
						key={asset._id.toString()}
						m={{ base: '0', md: '1rem' }}
						p='1rem'
						width={{ base: '100%', md: '65%'}}
					>
						<Heading
							textTransform='uppercase'
						>
							{asset.title}
						</Heading>
						<Box my='1rem' borderBottom='1px solid black' width='100%' />
						<Text
							lineHeight='200%'
							fontSize={asset.fontSize ?? ''}
							fontWeight='900'
							sx={{ ':hover': { cursor: 'default' } }}
							dangerouslySetInnerHTML={{ __html: asset.richDescription ?? '' }}
						/>
					</Box>

			})}
		</Flex>
	)
}

export default PatronProdList;