import connectDb from '../../lib/mongodb.js'
import EmotionSympItem from '../../models/Emotion_Symp_Item.js'
import FinancialOrMaterialSympItem from '../../models/Financial_Or_Material_Symp_Item.js'
import IdentitySympItem from '../../models/Identity_Symp_Item.js'
import PhysicalSympItem from '../../models/Physical_Symp_Item.js'

export default async (req, res) => {
  await connectDb()

  function handleModel(type) {
    if (type === 'Emotion') {
      return EmotionSympItem
    } else if (type === 'FinancialOrMaterial') {
      return FinancialOrMaterialSympItem
    } else if (type === 'Identity') {
      return IdentitySympItem
    } else if (type === 'Physical') {
      return PhysicalSympItem
    }
  }

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