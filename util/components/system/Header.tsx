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
	VStack
} from '@chakra-ui/react';
import Link from 'next/link'
import { useRouter } from 'next/router';
import Logout from './Logout';
import MobileHeader from "./MobileHeader";
import { PageType } from "../../../models/Page";

const Header = ({ pages }: { pages: PageType[] }) => {
	const [loggedIn, setLoggedIn] = useState(false);
	let [depthNum, setDepthNum] = useState(0);
	const { isOpen, onOpen, onClose } = useDisclosure();
	const router = useRouter();
	const desktop = useBreakpointValue(
		{
			base: false,
			md: true
		}
	)

	useEffect(() => {
		if(window.localStorage.getItem(process.env.NEXT_PUBLIC_LOGGED_IN_VAR as string)) {
			setLoggedIn(true)
		}
	}, [])

	useEffect(() => {
		function getDepth(pages: any) {
			return pages.reduce((acc: number, curr: any, currIndex: number) => {
				if (curr.childPagesIds.length) {
					return getDepth(curr.childPagesIds)
				} else {
					acc += 1;
					return acc;
				}
			}, 0)
		}
		setDepthNum(getDepth(pages))
	}, [])

	const handleChildren = useCallback((childPages: any, depth: number, parentId: string) => {
		return childPages.map((obj: any, index: number) => {
				const nextDepth = depth + 1;
					return <>
						<GridItem
							colStart={depth}
							rowStart={index}
							data-parent-id={parentId}
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
									href={obj.folderHref}
									passHref
								>
									{obj.title}
								</Link>
							</Text>
						</GridItem>
						{obj.childPagesIds &&
							handleChildren(obj.childPagesIds, nextDepth, obj._id)
						}
					</>
			})
	}, [pages, depthNum])

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
					position='relative'
				>
					{pages.map((obj, i) => {
						const depth = 1;
						if (obj.folderHref !== '/' && obj.showInNavigation) {
							return <>
								<Box
									data-parent-id={obj._id}
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
											href={obj.folderHref}
											passHref
										>
											{obj.title}
										</Link>
									</Text>
								</Box>
								<Grid
									gridTemplateColumns={`repeat(${depthNum}, 1fr)`}
									position='absolute'
								>
									{obj.childPagesIds &&
										handleChildren(obj.childPagesIds, depth, obj._id)
									}
								</Grid>
							</>
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

export default Header;