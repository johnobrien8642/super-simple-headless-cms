import { useEffect, useState } from 'react'
import Admin from '../../models/Admin'
import Link from 'next/link'
import { useRouter } from 'next/router'
import jwt from 'jsonwebtoken'
import connectDb from '../../lib/mongodb'

const SendEmails = ({ data }) => {
  let [title, setTitle] = useState('')
  let [sectionId, setSectionId] = useState('')
  let [writingType, setWritingType] = useState('piece')
  let [sending, setSending] = useState(false)
  let [success, setSuccess] = useState('')
  let [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (!data) router.push('/')
  }, [data])

  function handleSending() {
    if (sending) {
      return <div className='spinner-border'></div>
    }
  }

  function handleSuccessOrError() {
    if (success) {
      return <p>{success}</p>
    }
    if (error) {
      return <p>{error}</p>
    }
  }
 
  if (data) {
    return(
      <div
        className='send-email-container container mt-5'
      >
        <Link
          href='/admin'
        >
          Admin
        </Link>
        <h3>Send Emails</h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            setSending(true)
            const res = await fetch(`/api/send_emails`, {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                title,
                sectionId,
                writingType
              })
            })
            const returnedData = await res.json()
            
            if (res.ok) {
              setSuccess('Emails sent')
              setSending(false)
            } else {
              setError(`Error while sending emails: ${returnedData.errorMessage}`)
            }
          }}
        >
          <label
            htmlFor='title'
          >
            Title
            <input
              name='title'
              onInput={e => {
                setTitle(e.target.value)
              }}
            ></input>
          </label>
          <label
            htmlFor='sectionId'
          >
            Section Id
            <input
              name='sectionId'
              onInput={e => {
                setSectionId(e.target.value)
              }}
            ></input>
          </label>
          <label
            htmlFor='type'
          >
            Writing Type
            <select
              className='writing-type-dd'
              onChange={e => {
                setWritingType(e.target.value)
              }}
            >
              <option
                value='piece'
              >
                Piece
              </option>
              <option
                value='essay'
              >
                Essay
              </option>
            </select>
          </label>
          <button>Submit</button>
        </form>
        {handleSending()}
        {handleSuccessOrError()}
      </div>
    )
  }
}

export async function getServerSideProps(context) {
  await connectDb()
  let decoded
  if (context.req.cookies.token) {
    decoded = jwt.verify(context.req.cookies.token, process.env.SECRET_KEY)
  }
  const authenticated = await Admin
    .findById(decoded?.id)

  return {
    props: {
      data: !!authenticated,
    },
  }
}

export default SendEmails