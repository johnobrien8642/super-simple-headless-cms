import connectDb from '../../lib/mongodb.js'
import EmotionSympItem from '../../models/Emotion_Symp_Item'
import FinancialOrMaterialSympItem from '../../models/Financial_Or_Material_Symp_Item'
import IdentitySympItem from '../../models/Identity_Symp_Item'
import PhysicalSympItem from '../../models/Physical_Symp_Item'
import LossSympItem from '../../models/Loss_Symp_Item'

export default async (req, res) => {
  await connectDb()
  const { category } = req.body
  let model
  let modelArr
  let item
  let items
  let sympItems = []

  function handleModel(category) {
    if (category === 'emotions') {
      return EmotionSympItem
    } else if (category === 'financial-or-material') {
      return FinancialOrMaterialSympItem
    } else if (category === 'identity') {
      return IdentitySympItem
    } else if (category === 'physical') {
      return PhysicalSympItem
    } else if (category === 'loss') {
      return LossSympItem
    }
  }
  
  try {
    if (category === 'all') {
      modelArr = [ EmotionSympItem, FinancialOrMaterialSympItem, IdentitySympItem, PhysicalSympItem, LossSympItem ]
      for (let i = 0; i < modelArr.length; i++) {
        item = modelArr[i]
        items = await item.find({})
        sympItems = [...sympItems, ...items]
      }
    } else {
      model = handleModel(category)
      sympItems = await model
        .find({})
    }
    res.status(200).json({ success: true, sympItems: sympItems })
  } catch (err) {
    res.status(500).json({ success: false, errorMessage: err.message })
  }
}