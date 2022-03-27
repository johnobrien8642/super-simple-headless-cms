import mongoose from 'mongoose'
const Schema = mongoose.Schema

const LossSympItemSchema = new Schema({
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
    default: 'Loss'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})
  
const LossSympItem = mongoose.models?.LossSympItem || mongoose.model('LossSympItem', LossSympItemSchema, 'loss_symp_items')

export default LossSympItem