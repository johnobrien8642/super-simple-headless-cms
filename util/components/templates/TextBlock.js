import React from 'react';
import { Text, Box, Heading } from '@chakra-ui/react';

const TextBlock = ({ template }) => {
	return (
		<Box
			width='90%'
			m='auto'
			py='5rem'
		>
			{
				template.assetsIds.map(obj => {
					let resolveMargin;
					if (obj.textAlign === 'left') {
						resolveMargin = '0 auto 0 0'
					} else if (obj.textAlign === 'center') {
						resolveMargin = '0 auto'
					} else {
						resolveMargin = '0 0 0 auto'
					}
					return <Box
						width={{ base: '90%', lg: '75%' }}
						m={resolveMargin}
						py='1rem'
					>
						{obj.title && <Heading
							pb='1rem'
							as='h3'
							textAlign={obj.textAlign}
						>
							{obj.title}
						</Heading>}
						<Text
							as='span'
							dangerouslySetInnerHTML={{ __html: obj.richDescription }}
							textAlign={obj.textAlign}
						/>
					</Box>

				})
			}
		</Box>
	)
}

export default TextBlock;