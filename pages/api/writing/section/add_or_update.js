import connectDb from '../../../../lib/mongodb'
import Section from '../../../../models/Section'
import Piece from '../../../../models/Piece'
import Essay from '../../../../models/Essay'
import mongoose from 'mongoose'

export default async (req, res) => {
  await connectDb()
  let section
  let sectionToUpdate
  let sectionUpdateObj
  let writing
  let index
  let Model
  let Models = {
    piece: Piece,
    essay: Essay
  }
  let resolveWritingTypeId = {}
  
  if (req.method === 'POST') {
    const { deleteBool, update, writingId, sectionId, textHook, numberHook, titleHook, _id, type } = req.body
    Model = Models[type]
    
    resolveWritingTypeId[type] = writingId

    try {
      if (deleteBool) {
        section = await Section.findById(_id)
        await Section.deleteOne({ _id: mongoose.Types.ObjectId(_id) })
        writing = await Model
          .findById(section[type])

        writing.sections.splice(writing.sections.findIndex(_id => _id === section._id), 1)

        for (let i = 0; i < writing.sections.length; i++) {
          sectionToUpdate = writing.sections[i]

          sectionUpdateObj = await Section
            .findById(sectionToUpdate._id)
          
          sectionUpdateObj.sectionNumber = (i + 1)
          
          await sectionUpdateObj.save()
        }
        
      } else {
        if (update === 'true') {
          section = await Section.findById(sectionId)
          section.title = titleHook
          section.sectionNumber = numberHook
          section.sectionText = textHook

          await section.save()

          writing = await Model
            .findById(writingId)
            .populate('sections')

          writing.sections.splice(writing.sections.findIndex(obj => obj._id.toString() === section._id.toString()), 1)
          
          writing.sections.splice(section.sectionNumber - 1, 0, section._id)
  
          for (let i = 0; i < writing.sections.length; i++) {
            sectionToUpdate = writing.sections[i]
  
            sectionUpdateObj = await Section
              .findById(sectionToUpdate._id)
            
            sectionUpdateObj.sectionNumber = (i + 1)
            
            await sectionUpdateObj.save()
          }

          await writing.save()
        } else {
          section = new Section({
            title: titleHook,
            sectionNumber: numberHook,
            sectionText: textHook
          })

          section[type] = writingId
  
          await section.save()
  
          writing = await Model
            .findById(writingId)
            .populate('sections')
          
          writing.sections.splice(section.sectionNumber - 1, 0, section._id)
  
          for (let i = 0; i < writing.sections.length; i++) {
            sectionToUpdate = writing.sections[i]
  
            sectionUpdateObj = await Section
              .findById(sectionToUpdate._id)
            
            sectionUpdateObj.sectionNumber = (i + 1)
            
            await sectionUpdateObj.save()
          }

          await writing.save()
        }
      }
      res.status(200).json({ success: true, section })
    } catch (err) {
      res.status(500).json({ success: false, errorMessage: err.message })
    }
  }
}