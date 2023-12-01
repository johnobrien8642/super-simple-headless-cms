import React, { useState } from 'react';
import {
	Drawer,
	DrawerBody,
	DrawerFooter,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	Flex,
	Text,
	Button
} from "@chakra-ui/react";
import { useRouter } from 'next/router';


const MobileHeaderDrawers = ({
	placement = "right",
	width,
	isOpen,
	children,
	onClose,
	btnRef,
	title,
	footer,
}) => {
	const router = useRouter();
	return (
		<Flex w={width}>
			<Drawer
				isOpen={isOpen}
				placement={placement}
				onClose={onClose}
				finalFocusRef={btnRef}
			>
			<DrawerOverlay />
				<DrawerContent
					backgroundColor='black'
					alignItems="center"
				>
					<DrawerCloseButton alignSelf="end" />
					<DrawerHeader>
						<Button
							variant='link'
							sx={{
								':hover': {
									textDecoration: 'none'
								}
							}}
							onClick={() => {
								router.push('/');
								onClose();
							}}
							fontSize='6vw'
							fontWeight='400'
						>
							<Text>
								John Edward O'Brien
							</Text>
						</Button>
					</DrawerHeader>
					<DrawerBody>{children}</DrawerBody>
					<DrawerFooter>{footer}</DrawerFooter>
				</DrawerContent>
			</Drawer>
		</Flex>
	);
}

export default MobileHeaderDrawers;