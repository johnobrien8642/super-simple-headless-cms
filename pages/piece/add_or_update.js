import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const AddPiece = ({}) => {
  const router = useRouter()
  const { update, title, summary } = router.query
  let [titleHook, setTitle] = useState(title)
  let [summaryHook, setSummary] = useState(summary)
  
  return (
    <div
      className='add-piece container mt-5'
    >
      <Link
        href='/pieces/roll'
      >
        Back To Roll
      </Link>
      <form
        className='form'
        onSubmit={async (e) => {
          e.preventDefault()
          const res = await fetch('/api/piece/add_or_update', {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              update,
              titleHook,
              summaryHook
            })
          })
          const returnedData = await res.json()
          if (res.ok) {
            router.push('/pieces/roll')
          } else {
            console.log('Error in piece/add_or_update:', returnedData.errorMessage)
          }
        }}
      >
        <label
          htmlFor='title'
        >
          Title
          <input
            name='title'
            type='text'
            onInput={e => {
              setTitle(e.target.value)
            }}
          ></input>
        </label>
        <label
          htmlFor='summary'
        >
          Summary
          <textarea
            name='summary'
            type='text'
            onInput={e => {
              setSummary(e.target.value)
            }}
          ></textarea>
        </label>
        <button>Submit</button>
      </form>
    </div>
  )
}

export default AddPiece