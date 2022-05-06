import Piece from '../../models/Piece'
import Section from '../../models/Section'
import connectDb from '../../lib/mongodb'
import Link from 'next/link'

const SectionPage = ({ 
    data: { 
      section,
      prevSection,
      nextSection,
      pieceId
    } 
  }) => {
    const pSection = JSON.parse(section)
    const pPrevSection = JSON.parse(prevSection)
    const pNextSection = JSON.parse(nextSection)
    const pPieceId = JSON.parse(pieceId)
    
    function handlePrevOrNext(s) {
      if (s) {
        return (
          <Link
            href={{ pathname: '/piece/section', query: { sectionId: s._id } }}
          >
            {handleSection(s)}
          </Link>
        )
      }
    }
    
    function handleSection(s) {
      return s.sectionNumber + (s.title ? ` - ${s.title}` : '')
    }
    
    return (
      <div
        className='single-section-container container my-5'
      >
        <h3>{pSection.piece.title}</h3>
        <div
          className='links my-5'
        >
          {handlePrevOrNext(pPrevSection)}
          <Link
            href={{ pathname: '/pieces/roll' }}
          >
            All Pieces
          </Link>
          {handlePrevOrNext(pNextSection)}
        </div>
        <h1>{handleSection(pSection)}</h1>
        <div
          className='section-text'
          dangerouslySetInnerHTML={{ __html: pSection.sectionText }}
        ></div>
        <div
          className='links my-5'
        >
          {handlePrevOrNext(pPrevSection)}
          <Link
            href={{ pathname: '/pieces/roll' }}
          >
            All Pieces
          </Link>
          {handlePrevOrNext(pNextSection)}
        </div>
      </div>
    )
}

export async function getServerSideProps(context) {
  await connectDb()
  const { sectionId } = context.query

  const section = await Section
    .findById(sectionId)
    .populate('piece')
  
  const piece = await Piece
    .findById(section.piece)
    .populate('sections')
  
  const prevSection = piece.sections[piece.sections.findIndex(obj => parseInt(obj.sectionNumber) === (parseInt(section.sectionNumber) - 1))]
  const nextSection = piece.sections[piece.sections.findIndex(obj => parseInt(obj.sectionNumber) === (parseInt(section.sectionNumber) + 1))]

  return {
    props: {
      data: { section: JSON.stringify(section), prevSection: prevSection ? JSON.stringify(prevSection) : null, nextSection: nextSection ? JSON.stringify(nextSection) : null, pieceId: JSON.stringify(piece._id)  },
    },
  }
}

export default SectionPage