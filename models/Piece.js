import mongoose from 'mongoose'
const Schema = mongoose.Schema

const PieceSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  summary: {
    type: String
  },
  sections: {
    type: Array,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
})
  
const Piece = mongoose.models.Piece || mongoose.model('Piece', PieceSchema, 'pieces')

export default Piece