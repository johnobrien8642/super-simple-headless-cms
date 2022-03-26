import connectDb from '../../lib/mongodb.js'
import EmotionSympItem from '../../models/Emotion_Symp_Item.js'
import FinancialOrMaterialSympItem from '../../models/Financial_Or_Material_Symp_Item.js'
import IdentitySympItem from '../../models/Identity_Symp_Item.js'
import PhysicalSympItem from '../../models/Physical_Symp_Item.js'
import Post from '../../models/Post'

export default async (req, res) => {
  await connectDb()

  function handleModel(category) {
    if (category === 'emotions') {
      return EmotionSympItem
    } else if (category === 'financial-or-material') {
      return FinancialOrMaterialSympItem
    } else if (category === 'identity') {
      return IdentitySympItem
    } else if (category === 'physical') {
      return PhysicalSympItem
    }
  }

  if (req.method === 'POST') {
    const { string, sympathyAmount, category } = req.body
    const model = handleModel(category)
    
    const post = new model({
      item: string,
      sympathyAmount: sympathyAmount
    })
    console.log(post)
    try {
      await post.save()
      res.status(200).json({ success: true })
    } catch (err) {
      res.status(500).json({ success: false, errorMessage: err.message })
    }
  }
}