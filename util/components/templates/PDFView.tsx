import React, { useState, useEffect, useRef } from 'react'
import { Box, Flex, Text, Button } from '@chakra-ui/react'
import { BasePropsType } from '../types/prop_types'
import Link from 'next/link';
import { AssetsType, HydratedAssetsType } from '../../../models/Assets';

const PDFView = ({ template }: BasePropsType) => {
	const ref = useRef(null);
	const asset: AssetsType = template.assetsIds[0];
	const links: AssetsType[] = template.linksIds;
	return (
		<Flex
			direction='column'
			width='100%'
			height='100vh'
		>
			<Flex
				ml={{ base: 'auto', md: '8%' }}
			>
				{links.map(link => {
					return <Button
						key={link._id}
						m='1rem'
					>
						<Link
							href={link.extLink ?? ''}
						>
							{link.title}
						</Link>
					</Button>
				})}
			</Flex>
			<Box
				width='100%'
				height='100%'
			>
				<iframe
					ref={ref}
					src={process.env.NEXT_PUBLIC_CLOUDFRONT_URL as string + asset.assetKey + '#toolbar=0'}
					width='100%'
					height='100%'
				/>
			</Box>
		</Flex>
	)
}

export default PDFView;