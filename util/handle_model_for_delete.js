import EmotionSympItem from "../models/Emotion_Symp_Item"
import FinancialOrMaterialSympItem from "../models/Financial_Or_Material_Symp_Item"
import PhysicalSympItem from "../models/Physical_Symp_Item"
import IdentitySympItem from "../models/Identity_Symp_Item"
import LossSympItem from "../models/Loss_Symp_Item"

export default function handleModel(type) {
  if (type === 'Emotion') {
    return EmotionSympItem
  } else if (type === 'FinancialOrMaterial') {
    return FinancialOrMaterialSympItem
  } else if (type === 'Identity') {
    return IdentitySympItem
  } else if (type === 'Physical') {
    return PhysicalSympItem
  } else if (type === 'Loss') {
    return LossSympItem
  }
}