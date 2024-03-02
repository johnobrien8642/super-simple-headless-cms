import React, { useState, useEffect, useCallback } from "react";
import {
	Flex,
	Button,
	HStack,
	chakra,
	Text,
	Box,
	useBreakpointValue,
	Grid,
	GridItem,
	useDisclosure,
	VStack,
} from '@chakra-ui/react';
import Link from 'next/link'
import { useRouter } from 'next/router';
import Logout from './Logout';
import MobileHeader from "./MobileHeader";
import { PageType } from "../../../models/Page";
import HeaderPanel from "./HeaderPanel";

const Header = ({ pages }: { pages: PageType[] }) => {
	const [loggedIn, setLoggedIn] = useState(false);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const router = useRouter();
	const desktop = useBreakpointValue(
		{
			base: false,
			md: true
		}
	)
	const settings = {
		// Flip to true for hamburger nav panel with nested accordion links
		nestedDropdownNav: false
	}

	useEffect(() => {
		if(window.localStorage.getItem(process.env.NEXT_PUBLIC_LOGGED_IN_VAR as string)) {
			setLoggedIn(true)
		}
	}, [])

	if (settings.nestedDropdownNav) {
		return (
			<chakra.header id="header">
				<Flex
					w="100%"
					px="6"
					py='1rem'
					align="center"
					justify="space-between"
				>
					<Button
						variant='link'
						mr={desktop ? '2rem' : '0'}
						sx={{
							':hover': {
								textDecoration: 'none'
							}
						}}
						onClick={(e) => {
							e.preventDefault();
							router.push('/');
						}}
					>
						<Text
							as='h2'
							sx={{ ':hover': { cursor: 'pointer' } }}
							fontWeight='600'
							fontSize='min(5vw, 2rem)'
						>
							The Essays of Gerard Lorenz
						</Text>
					</Button>
					<HeaderPanel pages={pages} />
				</Flex>
			</chakra.header>
		);
	} else {
		return (
			<chakra.header id="header">
				<Flex
					w="100%"
					px="6"
					py='1rem'
					align="center"
					// justify="space-between"
				>
					<Button
						variant='link'
						mr={desktop ? '2rem' : '0'}
						sx={{
							':hover': {
								textDecoration: 'none'
							}
						}}
						onClick={(e) => {
							e.preventDefault();
							router.push('/');
						}}
					>
						<Text
							as='h2'
							sx={{ ':hover': { cursor: 'pointer' } }}
							fontWeight='600'
							fontSize='min(5vw, 2rem)'
						>
							The Essays of Gerard Lorenz
						</Text>
					</Button>

					{pages.length &&
						<MobileHeader
							pages={pages}
						/>
					}

					<HStack
						display={desktop ? 'flex' : 'none'}
						as="nav"
						spacing='1.5rem'
						position='relative'
					>
						{pages.map((obj, i) => {
							if (obj.folderHref !== '/' && obj.showInNavigation) {
								return <Box
										key={obj._id}
										mt='.2rem'
									>
										<Text
											key={obj._id}
											fontWeight={router.asPath === obj.folderHref ? '800' : '200'}
											fontSize={router.asPath === obj.folderHref ? '1.8rem !important' : '1.5rem'}
											sx={{
												'a:hover': {
													color: 'lightgray'
												}
											}}
										>
											<Link
												key={i}
												href={obj.folderHref ?? ''}
												passHref
											>
												{obj.title}
											</Link>
										</Text>
									</Box>
								}
							})}
						<Box>
							{loggedIn && <Logout />}
						</Box>
					</HStack>
				</Flex>
			</chakra.header>
		);
	}
}

export default Header;