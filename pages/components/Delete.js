import React from "react"

const Delete = ({
  loggedIn,
  id
}) => {

  if (loggedIn) {
    return (
      <div
        className='delete-form'
      >
        <form
          onSubmit={e => {
            e.preventDefault()
  
            const res = await fetch('/api/delete_piece_or_section.js', {
              method: 'POST',
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                id
              })
            })
            const returnedData = await res.json()
            if (res.ok) {
              window.location.reload()
            } else {
              console.log('Error in piece/section/add_or_update:', returnedData.errorMessage)
            }
          }}
        >
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

export default Delete