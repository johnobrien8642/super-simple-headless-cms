import React from 'react';
import { Center } from '@chakra-ui/react';
import TemplateMap from '../../TemplateMap';
import { useSearchParams } from 'next/navigation';
import { PageType } from '../../../models/Page';
import { TemplatesType } from '../../../models/Templates';
import { TemplatesEnum } from '../../../models/model-types';

const Templates = ({ templates }: { templates: TemplatesType[] }) => {
	const searchParams = useSearchParams();
	const mappedComps = templates
		?.filter(temp => temp?.showMobile)
		.map(temp => {
			let C = TemplateMap[temp.type as keyof typeof TemplatesEnum];
			let props = { key: temp._id, template: temp, searchParams };
			return <C {...props} />
		})

	return (
		<Center
			maxW='2000px'
			m='0 auto'
			flexDir='column'
		>
			{mappedComps}
		</Center>
	)
}
[]
export default Templates;