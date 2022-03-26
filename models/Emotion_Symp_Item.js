import mongoose from 'mongoose'
const Schema = mongoose.Schema

const EmotionSympItemSchema = new Schema({
  item: {
    type: String
  },
  sympathyAmount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    required: true,
    default: 'Emotion'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})
  
const EmotionSympItem = mongoose.models?.EmotionSympItem || mongoose.model('EmotionSympItem', EmotionSympItemSchema, 'emotion_symp_items')

export default EmotionSympItem