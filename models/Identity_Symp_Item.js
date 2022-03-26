import mongoose from 'mongoose'
const Schema = mongoose.Schema

const IdentitySympItemSchema = new Schema({
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
    default: 'Identity'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})
  
const IdentitySympItem = mongoose.models?.IdentitySympItem || mongoose.model('IdentitySympItem', IdentitySympItemSchema, 'identity_symp_items')

export default IdentitySympItem