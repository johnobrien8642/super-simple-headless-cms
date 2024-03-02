import {
	Box,
	Flex,
	Text,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
	AccordionIcon,
} from '@chakra-ui/react'
import Link from 'next/link';
import { PageType } from '../../../models/Page';

const HeaderAccordion = ({ pages }: { pages: PageType[] }) => {

	function handleChildren(page: PageType) {
		return <AccordionItem key={page._id}>
			<Flex>
				<Text
					whiteSpace='nowrap'
					p='1rem'
					fontSize='1.3rem'
				>
					<Link href={page.folderHref ?? ''}>
						{page.title}
					</Link>
				</Text>
				{!!page.childPagesIds.length &&
					<AccordionButton>
						<AccordionIcon />
					</AccordionButton>
				}
			</Flex>
			<AccordionPanel pb={4}>
				{page.childPagesIds.map(child => {
					return handleChildren(child)
				})}
			</AccordionPanel>
		</AccordionItem>
	}

	return (
		<Accordion
			allowMultiple
		>
			{pages.map(page => {
				if (page.folderHref !== '/') {
					return handleChildren(page)
				}
			})}
		</Accordion>
	)
};

export default HeaderAccordion;