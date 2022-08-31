import React, { useState, useEffect } from 'react'

const DeleteBtn = ({ post }) => {
  let [error, setError] = useState('')
  let [loggedIn, setLoggedIn] = useState(false)
  useEffect(() => {
    if (window.localStorage.getItem('loggedIn')) {
      setLoggedIn(true)
    }
  }, [])
  if (loggedIn) {
    return (
      <div
        className='form container'
      >
        <form
          onSubmit={async (e) => {
            e.preventDefault()
            const res = await fetch(`/api/post_delete`, {
              method: 'DELETE',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ post })
            })
  
            if (res.ok) {
              window.location.reload()
            } else {
              const data = await res.json()
              console.log('Error in DeleteBtn', data.errorMessage)
              setError(data.errorMessage)
            }
          }}
        >
          <button>Delete</button>
          <span
            className={`error${error ? ' active' : ''}`}
          >
            {error}
          </span>
        </form>
      </div>
    )
  } else {
    return (
      <React.Fragment>
      </React.Fragment>
    )
  }
}

export default DeleteBtn