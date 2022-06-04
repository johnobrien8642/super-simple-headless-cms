import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Section from '../../../models/Section'
import Essay from '../../../models/Essay'
import Admin from '../../../models/Admin'
import connectDb from '../../../lib/mongodb'
import jwt from 'jsonwebtoken'

const AddSection = ({ 
  essay,
  section,
  authenticated
}) => {
  const router = useRouter()
	const { update, writingId, sectionId, title, text, sectionLength, type } = router.query
  const pEssay = JSON.parse(essay)
  const pSection = JSON.parse(section)
  let [titleHook, setTitle] = useState(pSection?.title ? pSection.title : '')
  let [textHook, setText] = useState('')
  let [numberHook, setNumber] = useState(update === 'true' ? pSection?.sectionNumber : sectionLength)
  let [error, setError] = useState('')
  let [deleteBool, setDelete] = useState(false)
  let divRef = useRef(null)
  let initialRef = useRef(false)
  
  useEffect(() => {
    if (!authenticated) {
      router.push('/')
    }
    if (update === 'true' && initialRef.current === false) {
      divRef.current.innerHTML = pSection.sectionText
      setText(pSection.sectionText)
      initialRef.current = true
    }
  }, [authenticated, update, divRef, pSection])
  
  if (authenticated) {
    return (
      <div
        className='add-section-container container mt-5 hide'
      >
        <Link
          href='/essays/roll'
        >
          Back To Roll
        </Link>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            if (!textHook) {
              setError('Text is required for a section')
              return
            }
            const res = await fetch('/api/writing/section/add_or_update', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                deleteBool,
                update,
                writingId,
                sectionId,
                textHook,
                numberHook,
                titleHook,
                type
              })
            })
            const returnedData = await res.json()
            if (res.ok) {
              router.push('/essays/roll')
            } else {
              console.log('Error in piece/section/add_or_update:', returnedData.errorMessage)
            }
          }}
        >
          <label
            htmlFor='title'
          >
            Title (optional)
            <input
              name='title'
              type='text'
              value={titleHook}
              onInput={e => {
                setTitle(e.target.value)
              }}
            ></input>
          </label>
          <label
            htmlFor='number'
            className='section-number'
          >
            Section Number
            <input
              name='number'
              type='number'
              min='1'
              value={numberHook}
              onInput={e => {
                setNumber(e.target.value)
              }}
            ></input>
          </label>
          <h3>Input Text</h3>
          <span>{error ? error : ''}</span>
          <div
            className='text-input-container container'
            contentEditable='true'
            value={textHook}
            ref={divRef}
            onInput={e => {
              setText(e.target.innerHTML)
              divRef.current.value = e.target.innerText
            }}
          ></div>
          <button>Submit</button>
        </form>
      </div>
    )
  } else {
    return (
      <div></div>
    )
  }
}

export async function getServerSideProps(context) {
  await connectDb()
  let decoded
  if (context.req.cookies.token) {
    decoded = jwt.verify(context.req.cookies.token, process.env.SECRET_KEY)
  }

  const { writingId, sectionId } = context.query

  const essay = await Essay
    .findById(writingId)
    .populate('sections')

  const section = await Section
    .findById(sectionId)

  const authenticated = await Admin
    .findById(decoded?.id)

  return {
    props: { essay: JSON.stringify(essay), section: JSON.stringify(section), authenticated: !!authenticated },
  };
}

export default AddSection;