import connectDb from '../lib/mongodb';
import PageManager, { PageManagerType } from '../models/PageManager';
import { NextApiResponse } from 'next';
import { PageType } from '../models/Page';

function generateSiteMap(data: { pageIds: PageType[] }) {
	return `<?xml version="1.0" encoding="UTF-8"?>
	<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
		<url>
			<loc>https://www.johneobrien.com</loc>
		</url>
		${data.pageIds
			.map((page) => {
				 return `
					<url>
						<loc>${`https://www.johneobrien.com${page.folderHref}`}</loc>
					</url>
				`;
			})
			.join('')}
	</urlset>
 `;
}

function SiteMap() {
	// getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }: { res: NextApiResponse }) {
	await connectDb();
	// We make an API call to gather the URLs for our site
	const data = await PageManager.find({}).populate('pageIds');

	// We generate the XML sitemap with the posts data
	const sitemap = generateSiteMap(data[0] as PageManagerType);

	res.setHeader('Content-Type', 'text/xml');
	// we send the XML to the browser
	res.write(sitemap);
	res.end();

	return {
		props: {}
	};
}

export default SiteMap;
