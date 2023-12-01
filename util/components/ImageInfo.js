import React from 'react';
import {
	Heading,
	Button,
	Text
} from '@chakra-ui/react';
import Link from 'next/link';

const ImageInfo = ({ image }) => {
	return (
		<>
			<Heading my={{ base: '1rem', md: '2rem' }}>{image.title}</Heading>
			{
				image.extLink &&
					<Link
						my='1rem'
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
		</>
	)
}

export default ImageInfo;