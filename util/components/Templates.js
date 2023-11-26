import React from 'react';
import TemplateMap from '../TemplateMap';
import { useSearchParams } from 'next/navigation';

const Templates = ({ page }) => {
	const searchParams = useSearchParams();

	const mappedComps = page?.templatesIds?.map(temp => {
		let C = TemplateMap[temp.type];
		let props = { key: temp._id, template: temp, searchParams };
		return <C {...props} />
	})

	return (
		<>
			{mappedComps}
		</>
	)
}
[]
export default Templates;