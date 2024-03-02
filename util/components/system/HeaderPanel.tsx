import React, { useState, useEffect, useCallback, useRef } from "react";
import {
	Flex,
	Button,
	IconButton,
	HStack,
	chakra,
	Text,
	Box,
	useBreakpointValue,
	Grid,
	GridItem,
	useDisclosure,
	VStack,
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton
} from '@chakra-ui/react';
import { HamburgerIcon } from "@chakra-ui/icons";
import Link from 'next/link'
import { useRouter } from 'next/router';
import Logout from './Logout';
import MobileHeader from "./MobileHeader";
import { PageType } from "../../../models/Page";
import HeaderAccordion from "./HeaderAccordion";

const HeaderPanel = ({ pages }: { pages: PageType[] }) => {
	const { isOpen, onOpen, onClose } = useDisclosure()
	const btnRef = useRef(null)

	return (
		<>
			<IconButton
				ref={btnRef}
				icon={<HamburgerIcon />}
				aria-label='menu button'
				onClick={onOpen}
			/>
			<Drawer
				isOpen={isOpen}
				placement='right'
				onClose={onClose}
				finalFocusRef={btnRef}
				size='md'
			>
				<DrawerOverlay />
				<DrawerContent
					bg='var(--chakra-colors-chakra-body-bg)'
				>
					<DrawerCloseButton />
					<DrawerHeader p='1rem'>Brian O'Corcoran</DrawerHeader>
					<HeaderAccordion pages={pages} />
				</DrawerContent>
			</Drawer>
		</>
	  )
}

export default HeaderPanel;