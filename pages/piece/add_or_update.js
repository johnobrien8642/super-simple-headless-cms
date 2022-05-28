import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'

const AddPiece = ({}) => {
  const router = useRouter()
  const { update, pieceId, title, summary, finished } = router.query
  let [titleHook, setTitle] = useState(title ? title : '')
  let [summaryHook, setSummary] = useState(summary ? summary : '')
  let [finishedHook, setFinished] = useState(finished ? finished : false)
  console.log(finishedHook)
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
              _id: pieceId,
              titleHook,
              summaryHook,
              finishedHook
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
            value={titleHook}
            onInput={e => {
              setTitle(e.target.value)
            }}
          ></input>
        </label>
        <div
          className='status'
        >
          <span>Status: </span>
          <label
            htmlFor='title'
          >
            Finished
            <input
              name='title'
              type='radio'
              defaultChecked={finishedHook}
              onClick={() => {
                setFinished(true)
              }}
            ></input>
          </label>
          <label
            htmlFor='title'
          >
            Ongoing
            <input
              name='title'
              type='radio'
              defaultChecked={!finishedHook}
              onClick={() => {
                setFinished(false)
              }}
            ></input>
          </label>
        </div>
        <label
          htmlFor='summary'
        >
          Summary
          <textarea
            name='summary'
            type='text'
            value={summaryHook}
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