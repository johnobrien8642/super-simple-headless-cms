import { useState, useEffect } from 'react'

const Form = () => {
  let [link, setLink] = useState('')
  let [title, setTitle] = useState('')
  let [description, setDescription] = useState('')
  let [price, setPrice] = useState('')
  let [photo, setPhoto] = useState(true)
  let [success, setSuccess] = useState(false)
  let [error, setError] = useState('')

  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false)
      }, 2000)
      reset()
    }
  })

  function reset() {
    setLink('')
    setTitle('')
    setDescription('')
    setPrice('')
    setError('')
  }

  return (
    <div
      className='form container'
    >
      <button
        onClick={e => {
          e.preventDefault()
          setPhoto(!photo)
        }}
      >
        {photo ? 'Photo' : 'Book'}
      </button>
      <form
        onSubmit={async (e) => {
          e.preventDefault()
          const res = await fetch(`/api/post_create`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
              link: link,
              title: title,
              description: description,
              price: price,
              type: photo ? 'Photo' : 'Book'
            })
          })

          if (res.ok) {
            reset()
            setSuccess(true)
          } else {
            const data = await res.json()
            console.log('Error in Form', data.errorMessage)
            setError(data.errorMessage)
          }
        }}
      >
        <div
          className='link'
        >
          <span>Image Link</span>
          <input
            value={link}
            onInput={e => {
              setLink(e.target.value)
            }}
          />
        </div>
        <div
          className='title'
        >
          <span>Title</span>
          <input
            value={title}
            onInput={e => {
              setTitle(e.target.value)
            }}
          />
        </div>
        <div
          className='description'
        >
          <span>Description</span>
          <input
            value={description}
            onInput={e => {
              setDescription(e.target.value)
            }}
          />
        </div>
        <div
          className='price'
        >
          <span>Price</span>
          <input
            type='number'
            value={price}
            onInput={e => {
              setPrice(e.target.value)
            }}
          />
        </div>
        <button>Create</button>
        <span
          className={`success${success ? ' active' : ''}`}
        >
          Success
        </span>
        <span
          className={`error${error ? ' active' : ''}`}
        >
          {error}
        </span>
      </form>
    </div>
  )
}

export default Form