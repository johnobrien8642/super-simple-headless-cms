import React, { useRef } from "react";
import { useDisclosure, Flex, Box, Button, Text, VStack, Icon, HStack, IconButton, useBreakpointValue } from "@chakra-ui/react";
import Link from "next/link";
import { HamburgerIcon } from '@chakra-ui/icons';
import MobileHeaderDrawers from "./MobileHeaderDrawers";


const MobileHeader = ({ pages }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = useRef();
	const desktop = useBreakpointValue(
		{
			base: false,
			md: true
		}
	)

  return (
		<Flex
			ml='auto'
			display={desktop ? 'none' : 'block'}
		>
			<IconButton
				ref={btnRef}
				onClick={onOpen}
				icon={<HamburgerIcon />}
			/>

			<MobileHeaderDrawers
				isOpen={isOpen}
				onClose={onClose}
				finalFocusRef={btnRef}
			>
				<VStack alignItems="left">
					{pages.map((obj, i) => (
						<Text
							fontSize='1.5rem'
							sx={{
								':focus': {
									color: 'white !important'
								},
								'a:hover': {
									color: 'lightgray'
								}
							}}
						>
							<Link
								key={i}
								href={obj.folderHref}
								passHref
								onClick={onClose}
							>
								{obj.title}
							</Link>
						</Text>
					))}
				</VStack>
			</MobileHeaderDrawers>
		</Flex>
	);
};

export default MobileHeader;