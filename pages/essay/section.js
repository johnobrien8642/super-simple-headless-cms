import Essay from '../../models/Essay'
import Section from '../../models/Section'
import connectDb from '../../lib/mongodb'
import Link from 'next/link'

const SectionPage = ({ 
    data: { 
      section,
      prevSection,
      nextSection,
      essayId
    } 
  }) => {
    const pSection = JSON.parse(section)
    const pPrevSection = JSON.parse(prevSection)
    const pNextSection = JSON.parse(nextSection)
    const pEssayId = JSON.parse(essayId)
    
    function handlePrevOrNext(s) {
      return (
        <Link
          href={{ pathname: '/essay/section', query: { sectionId: s?._id } }}
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
          href={{ pathname: '/essays/roll' }}
        >
          <a className='show all-pieces'>All</a>
        </Link>
        <h4 className='top'>{pSection.essay.title}</h4>
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
        <h4 className='bottom'>{pSection.essay.title}</h4>
        <Link
          href={{ pathname: '/essays/roll' }}
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
  
  const essay = await Essay
    .findById(section.essay)
    .populate('sections')
  
  const prevSection = essay.sections[essay.sections.findIndex(obj => parseInt(obj.sectionNumber) === (parseInt(section.sectionNumber) - 1))]
  const nextSection = essay.sections[essay.sections.findIndex(obj => parseInt(obj.sectionNumber) === (parseInt(section.sectionNumber) + 1))]

  return {
    props: {
      data: { section: JSON.stringify(section), prevSection: prevSection ? JSON.stringify(prevSection) : null, nextSection: nextSection ? JSON.stringify(nextSection) : null, essayId: JSON.stringify(essay._id)  },
    },
  }
}

export default SectionPage