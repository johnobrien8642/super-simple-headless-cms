import { useState, useEffect, useRef } from 'react'

const SubscribeForm = () => {
  let [email, setEmail] = useState('')
  let [success, setSuccess] = useState('')
  let [error, setError] = useState('')

  function handleSuccessOrError() {
    if (success) {
      return (
        <p>{success}</p>
      )
    }
    if (error) {
      return (
        <p>{error}</p>
      )
    }
  }

  return (
    <div
      className='subscribe-form-container'
    >
      <h5>
        Subscribe with your email and I'll send you an email notification
        when I upload new writing.
      </h5>
      <form
        onSubmit={async (e) => {
          e.preventDefault()

          const res = await fetch(`/api/handle_subscription`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email
            })
          })
          
          const returnedData = await res.json()
          if (res.ok) {
            setEmail('')
            setSuccess("I've sent you an email, if you received it, you're successfully subscribed. If not, double check your email and try again. - Mikowski")
          } else {
            if (returnedData.alreadyExists) {
              setError("You're already subscribed.")
            } else {
              setError('There was an error, double-check and make sure email is correct and a valid email.')
            }
          }
        }}
      >
        <input
          value={email}
          onInput={e => {
            setEmail(e.target.value)
          }}
        ></input>
        <button>Subscribe</button>
        {handleSuccessOrError()}
      </form>
      <p className='guarantee'>I will never, ever use your email for anything other than sending you new writing notifications.</p>
    </div>
  )
}

export default SubscribeForm