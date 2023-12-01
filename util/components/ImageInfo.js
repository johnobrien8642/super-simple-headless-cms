import React from 'react';
import {
	Heading,
	Button,
	Text,
	Box
} from '@chakra-ui/react';
import Link from 'next/link';

const ImageInfo = ({ image }) => {
	return (
		<Box
			display='flex'
			flexDir='column'
			gap={{ base: '.3rem', md: '1rem' }}
			my={{ base: '.3rem', md: '1rem' }}
			px={{ base: '1rem', md: '2rem' }}
			maxW={{ base: '95%', md: '82%' }}
		>
			<Heading>{image.title}</Heading>
			{
				image.extLink &&
					<Link
						href={image.extLink ?? ''}
						passHref={true}
						target='_blank'
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
				overflow='auto'
				display='inline-block'
				dangerouslySetInnerHTML={{ __html: image.richDescription }}
			/>
		</Box>
	)
}

export default ImageInfo;