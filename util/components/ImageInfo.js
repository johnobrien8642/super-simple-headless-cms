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
			justifyContent='space-between'
			gap={{ base: '.3rem', md: '1rem' }}
			my={{ base: '.3rem', md: '1rem' }}
			px={{ base: '1rem', md: '1rem' }}
		>
			<Heading>{image.title}</Heading>
			{
				image.extLink &&
					<Link
						href={image.extLink ?? ''}
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
				dangerouslySetInnerHTML={{ __html: image.richDescription }}
			/>
		</Box>
	)
}

export default ImageInfo;