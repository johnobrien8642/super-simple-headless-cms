import mongoose from 'mongoose'
const Schema = mongoose.Schema

const FinancialOrMaterialSympItemSchema = new Schema({
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
    default: 'FinancialOrMaterial'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})
  
const FinancialOrMaterialSympItem = mongoose.models?.FinancialOrMaterialSympItem || mongoose.model('FinancialOrMaterialSympItem', FinancialOrMaterialSympItemSchema, 'financial_or_material_symp_items')

export default FinancialOrMaterialSympItem