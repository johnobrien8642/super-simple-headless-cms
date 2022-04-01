import mongoose from 'mongoose'
const Schema = mongoose.Schema

const PhysicalSympItemSchema = new Schema({
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
    default: 'Physical'
  },
  subType: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})
  
const PhysicalSympItem = mongoose.models?.PhysicalSympItem || mongoose.model('PhysicalSympItem', PhysicalSympItemSchema, 'physical_symp_items')

export default PhysicalSympItem