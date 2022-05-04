import connectDb from '../../../lib/mongodb'
import Piece from '../../../models/Piece'

export default async (req, res) => {
  await connectDb()
  let piece
  
  if (req.method === 'POST') {
    const { update, titleHook, summaryHook } = req.body
    try {
      if (update === 'true') {
        
      } else {
        piece = new Piece({ title: titleHook, summary: summaryHook })
        await piece.save()
      }
      res.status(200).json({ success: true, piece })
    } catch (err) {
      res.status(500).json({ success: false, errorMessage: err.message })
    }
  }
}