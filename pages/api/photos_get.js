import connectDb from '../../lib/mongodb.js'
import Post from '../../models/Post'

export default async (req, res) => {
  await connectDb()
  if (req.method === 'GET') {
    try {
      const posts = await Post
        .find({
          type: 'Photo'
        })
      res.status(200).json({ success: true, posts: posts })
    } catch (err) {
      res.status(500).json({ success: false, errorMessage: err.message })
    }
  }
}