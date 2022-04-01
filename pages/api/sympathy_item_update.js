import connectDb from '../../lib/mongodb.js'
import handleModel from '../../util/handle_model.js'

export default async (req, res) => {
  await connectDb()

  if (req.method === 'POST') {
    const { id, strings, sympathyAmount, category, subcategory } = req.body
    const model = handleModel(category)
    const post = await model.findById(id)

    post.item = strings[0]
    post.sympathyAmount = sympathyAmount
    if (subcategory) {
      post.subType = subcategory
    }

    try {
      await post.save()
      res.status(200).json({ success: true, post: post })
    } catch (err) {
      res.status(500).json({ success: false, errorMessage: err.message })
    }
  }
}