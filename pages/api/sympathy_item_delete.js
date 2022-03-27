import connectDb from '../../lib/mongodb.js'
import handleModel from '../../util/handle_model.js'

export default async (req, res) => {
  await connectDb()

  if (req.method === 'DELETE') {
    const { id, type } = req.body
    const model = handleModel(type)
    const post = await model.deleteOne({ _id: id })
    
    try {
      res.status(200).json({ success: true, id: id })
    } catch (err) {
      res.status(500).json({ success: false, errorMessage: err.message })
    }
  }
}