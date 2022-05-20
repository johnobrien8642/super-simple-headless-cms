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
      return (
        <Link
          href={{ pathname: '/piece/section', query: { sectionId: s?._id } }}
        >
          <a className={`${s ? 'show' : ''}`}>{handleSection(s)}</a>
        </Link>
      )
    }
    
    function handleSection(s) {
      if (s) {
        return s.sectionNumber + (s.title ? ` - ${s.title}` : '')
      } else {
        return ''
      }
    }
    
    return (
      <div
        className='single-section-container container my-5'
      >
        <Link
          href={{ pathname: '/pieces/roll' }}
        >
          <a className='show all-pieces'>All</a>
        </Link>
        <h4 className='top'>{pSection.piece.title}</h4>
        <div
          className='links my-5'
        >
          {handlePrevOrNext(pPrevSection)}
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
          {handlePrevOrNext(pNextSection)}
        </div>
        <h4 className='bottom'>{pSection.piece.title}</h4>
        <Link
          href={{ pathname: '/pieces/roll' }}
        >
          <a className='show all-pieces'>All</a>
        </Link>
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