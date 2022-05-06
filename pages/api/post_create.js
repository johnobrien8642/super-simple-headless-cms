import connectDb from '../../lib/mongodb.js'
import Post from '../../models/Post'
import { getPlaiceholder } from 'plaiceholder'

export default async (req, res) => {
  await connectDb()

  const postCount = await Post
    .find({})
    .count()

  if (req.method === 'POST') {
    const { link, title, description, price, type } = req.body

    const { base64 } = await getPlaiceholder(link)
    
    const post = new Post({
      link: link,
      blurString: base64,
      title: title,
      description: description,
      price: price,
      type: type,
      number: (postCount + 1)
    })
    try {
      await post.save()
      res.status(200).json({ success: true })
    } catch (err) {
      res.status(500).json({ success: false, errorMessage: err.message })
    }
  }
}