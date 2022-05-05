import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'
const Schema = mongoose.Schema

const SectionSchema = new Schema({
  piece: {
    type: mongoose.Types.ObjectId,
    ref: 'Piece',
    required: true
  },
  title: {
    type: String
  },
  sectionNumber: {
    type: String,
    required: true
  },
  sectionText: {
    type: String,
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
  
const Section = mongoose.models.Section || mongoose.model('Section', SectionSchema, 'sections')

export default Section