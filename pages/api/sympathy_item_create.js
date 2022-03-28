import connectDb from '../../lib/mongodb.js'
import handleModel from '../../util/handle_model.js'

export default async (req, res) => {
  await connectDb()
  let post

  if (req.method === 'POST') {
    const { strings, sympathyAmount, category } = req.body
    const model = handleModel(category)
  
    try {
      for (let i = 0; i < strings.length; i++) {
        post = new model({
          item: strings[i].toLowerCase().trim(),
          sympathyAmount: sympathyAmount
        })
        await post.save()
      }
      res.status(200).json({ success: true })
    } catch (err) {
      res.status(500).json({ success: false, errorMessage: err.message })
    }
  }
}