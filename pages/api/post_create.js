import connectDb from '../../lib/mongodb.js'
import Post from '../../models/Post'

export default async (req, res) => {
  await connectDb()

  const postCount = await Post
    .find({})
    .count()

  if (req.method === 'POST') {
    const { link, title, description, price, type } = req.body
    const post = new Post({
      link: link,
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