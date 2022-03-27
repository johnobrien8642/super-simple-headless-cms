import connectDb from '../../lib/mongodb.js'
import handleModel from '../../util/handle_model.js'

export default async (req, res) => {
  await connectDb()

  if (req.method === 'POST') {
    const { string, sympathyAmount, category } = req.body
    const model = handleModel(category)
    
    const post = new model({
      item: string.toLowerCase(),
      sympathyAmount: sympathyAmount
    })
    
    try {
      await post.save()
      res.status(200).json({ success: true })
    } catch (err) {
      res.status(500).json({ success: false, errorMessage: err.message })
    }
  }
}