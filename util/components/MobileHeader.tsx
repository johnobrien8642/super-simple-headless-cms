import React, { useRef } from "react";
import {
	useDisclosure,
	Flex,
	Text,
	VStack,
	IconButton,
	useBreakpointValue
} from "@chakra-ui/react";
import Link from "next/link";
import { HamburgerIcon } from '@chakra-ui/icons';
import MobileHeaderDrawers from "./MobileHeaderDrawers";
import { PageType } from "../../models/Page";

const MobileHeader = ({ pages }: { pages: PageType[] }) => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef: React.MutableRefObject<HTMLButtonElement | null> = useRef(null);
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
				aria-label='Hamburger Icon'
			/>

			<MobileHeaderDrawers
				isOpen={isOpen}
				onClose={onClose}
			>
				<VStack alignItems="left">
					{pages.map((obj, i) => (
						<Text
							key={obj._id}
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