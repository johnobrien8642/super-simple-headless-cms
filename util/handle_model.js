import EmotionSympItem from '../models/Emotion_Symp_Item';
import FinancialOrMaterialSympItem from '../models/Financial_Or_Material_Symp_Item';
import PhysicalSympItem from '../models/Physical_Symp_Item';
import IdentitySympItem from '../models/Identity_Symp_Item';
import LossSympItem from '../models/Loss_Symp_Item';

export default function handleModel(category) {
    if (category === 'emotions') {
        return EmotionSympItem;
    } else if (category === 'financial-or-material') {
        return FinancialOrMaterialSympItem;
    } else if (category === 'identity') {
        return IdentitySympItem;
    } else if (category === 'physical') {
        return PhysicalSympItem;
    } else if (category === 'loss') {
        return LossSympItem;
    }
}
