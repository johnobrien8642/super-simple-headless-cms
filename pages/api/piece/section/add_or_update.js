import connectDb from '../../../../lib/mongodb'
import Section from '../../../../models/Section'
import Piece from '../../../../models/Piece'
import mongoose from 'mongoose'

export default async (req, res) => {
  await connectDb()
  let section
  let sectionToUpdate
  let sectionUpdateObj
  let piece
  let index
  
  if (req.method === 'POST') {
    const { deleteBool, update, pieceId, sectionId, textHook, numberHook, titleHook } = req.body
    try {
      if (deleteBool === 'true') {
        await Section.deleteOne({ _id: mongoose.Types.ObjectId(sectionId) })
        piece = await Piece
          .findById(pieceId)
          .populate('sections')
        
        piece.sections.splice(piece.sections.findIndex(obj => obj._id === pieceId), 1)

        for (let i = 0; i < piece.sections.length; i++) {
          sectionToUpdate = piece.sections[i]

          sectionUpdateObj = await Section
            .findById(sectionToUpdate._id)
          
          sectionUpdateObj.sectionNumber = i + 1
          
          await sectionUpdateObj.save()
        }
        
      } else {
        if (update === 'true') {
          
        } else {
          section = new Section({
            piece: pieceId,
            title: titleHook,
            sectionNumber: numberHook,
            sectionText: textHook
          })
  
          await section.save()
  
          piece = await Piece
            .findById(pieceId)
            .populate('sections')
          
          piece.sections.splice(section.sectionNumber - 1, 0, section)
  
          for (let i = 0; i < piece.sections.length; i++) {
            sectionToUpdate = piece.sections[i]
  
            sectionUpdateObj = await Section
              .findById(sectionToUpdate._id)
            
            sectionUpdateObj.sectionNumber = i + 1
            
            await sectionUpdateObj.save()
          }
          await piece.save()
        }
      }
      res.status(200).json({ success: true, section })
    } catch (err) {
      res.status(500).json({ success: false, errorMessage: err.message })
    }
  }
}