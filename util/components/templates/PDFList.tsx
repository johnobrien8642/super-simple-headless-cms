import React from 'react';
import { Box, Flex, Text, Heading } from '@chakra-ui/react';
import Link from 'next/link';
import { TemplatesType } from '../../../models/Templates';
import { PageType } from '../../../models/Page';

const PDFList = ({ template }: { template: TemplatesType}) => {
	return (
		<Flex
			direction='column'
			width={{ base: '100%', md: '90%'}}
		>
			{template.pagesIds.map(page => {
				return page.childPagesIds.map((child: PageType) => {
					return <Box
						key={child._id.toString()}
						// m='1rem'
						m={{ base: '0', md: '1rem' }}
						p='1rem'
						width={{ base: '100%', md: '65%'}}
					>
						<Heading
							textTransform='uppercase'
						>
							<Link
								href={child.folderHref ?? ''}
							>
								{child.title}
							</Link>
						</Heading>
						<Box my='1rem' borderBottom='1px solid black' width='3rem' />
						<Text
							lineHeight='2rem'
							fontSize='1.2rem'
							sx={{ ':hover': { cursor: 'default' } }}
						>
							{child.description}
						</Text>
					</Box>
				})
			})}
		</Flex>
	)
}

export default PDFList;