import React from 'react';
import {
	Drawer,
	DrawerBody,
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
	isOpen,
	onClose,
	children
}: {
	isOpen: boolean;
	onClose: () => void;
	children?: React.ReactNode
}) => {
	const router = useRouter();
	return (
		<Flex>
			<Drawer
				isOpen={isOpen}
				onClose={onClose}
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
				</DrawerContent>
			</Drawer>
		</Flex>
	);
}

export default MobileHeaderDrawers;