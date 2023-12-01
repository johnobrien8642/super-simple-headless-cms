import React, { useState, useRef, useEffect } from "react";
import {
	Flex,
	Button,
	HStack,
	chakra,
	Text,
	Box,
	useDisclosure,
	useBreakpointValue
} from '@chakra-ui/react';
import Link from 'next/link'
import { useRouter } from 'next/router';
import { useParams } from 'next/navigation';
import Logout from './Logout';
import MobileHeader from "./MobileHeader";
import { HamburgerIcon } from '@chakra-ui/icons';

const Header = ({ pages }) => {
	const [openNav, setOpenNav] = useState('');
	const [loggedIn, setLoggedIn] = useState(false)
	const dropdownRef = useRef(null);
	const router = useRouter();
	const params = useParams();
	const pathname = router.pathname;
	const desktop = useBreakpointValue(
		{
			base: false,
			md: true
		}
	)

	useEffect(() => {
		if(window.localStorage.getItem(process.env.NEXT_PUBLIC_LOGGED_IN_VAR)) {
			setLoggedIn(true)
		}
	}, [])

	function handleLoggedIn() {
		if (loggedIn) {
			return Logout({ router });
		}
	}

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
						fontWeight='400'
						fontSize='min(7vw, 2rem)'
					>
						John Edward O'Brien
					</Text>
				</Button>

				<MobileHeader
					pages={pages}
				/>

				<HStack
					display={desktop ? 'flex' : 'none'}
					as="nav"
					spacing='1.5rem'
				>
					{pages.map((obj, i) => {
						if (obj.folderHref !== '/' && obj.showInNavigation) {
							return <Text
								fontWeight={(obj.pageSelected || router.asPath) === obj.folderHref ? '800' : '200'}
								fontSize={(obj.pageSelected || router.asPath) === obj.folderHref ? '1.8rem !important' : '1.5rem'}
								sx={{
									'a:hover': {
										color: 'lightgray'
									}
								}}
							>
								<Link
									key={i}
									href={obj.folderHref}
									passHref
								>
									{obj.title}
								</Link>
							</Text>
						}
					})}
					<Box>
						{handleLoggedIn()}
					</Box>
				</HStack>
			</Flex>
		</chakra.header>
	);
}

export default Header;