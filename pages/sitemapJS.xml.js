import connectDb from '../lib/mongodb'
import Post from '../models/Post'

function generateSiteMap(data) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>https://www.johnedwardobrien.com</loc>
     </url>
     ${data.posts
       .map(({ id }) => {
         return `
       <url>
           <loc>${`https://www.johnedwardobrien.com/posts/${id}`}</loc>
       </url>
     `
       })
       .join('')}
   </urlset>
 `
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  await connectDb()
  // We make an API call to gather the URLs for our site
  const data = await Post
    .find({})

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(data)

  res.setHeader('Content-Type', 'text/xml')
  // we send the XML to the browser
  res.write(sitemap)
  res.end()

  return {
    props: {}
  }
}

export default SiteMap