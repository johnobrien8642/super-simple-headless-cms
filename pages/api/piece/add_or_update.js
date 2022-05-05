import connectDb from '../../../lib/mongodb'
import Piece from '../../../models/Piece'
import Section from '../../../models/Section'

export default async (req, res) => {
  await connectDb()
  let piece
  let section
  
  if (req.method === 'POST') {
    const { deleteBool, _id, update, titleHook, summaryHook } = req.body
    try {
      if (deleteBool === 'true') {
        piece = await Piece.findById(_id).populate('sections')
        await Piece.deleteOne({ _id: piece._id })

        for (let i = 0; i < piece.sections.length; i++) {
          section = sections[i]
          await Section.deleteOne({ _id: section._id })
        }
      } else {
        if (update === 'true') {
          
        } else {
          piece = new Piece({ title: titleHook, summary: summaryHook })
          await piece.save()
        }
      }
      res.status(200).json({ success: true, piece })
    } catch (err) {
      res.status(500).json({ success: false, errorMessage: err.message })
    }
  }
}