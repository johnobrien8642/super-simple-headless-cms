import { useRouter } from 'next/router'

const PostShow = ({ post, single }) => {
  const { _id, link, title, description, price, number, type } = post
  const router = useRouter()

  function handleViewButton() {
    if (!single) {
      return(
        <button
          className='view-btn'
          onClick={e => {
            e.preventDefault()
            router.push(`/posts/${_id}`)
          }}
        >
          View
        </button>
      )
    }
  }

  return (
    <div
      className='post-show col-md'
    >
      <img className='w-100' src={link} />
      <span className='number'>{number}</span>
      <h1>{title}</h1>
      <p>{description}</p>
      <p
        className='price'
      >
        Asking Price: ${price}
      </p>
      {handleViewButton()}
    </div>
  )
}

export default PostShow