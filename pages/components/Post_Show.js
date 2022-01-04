import { useRouter } from 'next/router'

const PostShow = ({ post, single }) => {
  const router = useRouter()

  function handleViewButton() {
    if (!single) {
      return(
        <button
          className='view-btn'
          onClick={e => {
            e.preventDefault()
            router.push(`/posts/${post?._id}`)
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
      <img className='w-100' src={post?.link} />
      <span className='number'>{post?.number}</span>
      <h1>{post?.title}</h1>
      <p>{post?.description}</p>
      <p
        className='price'
      >
        Asking Price: ${post?.price}
      </p>
      {handleViewButton()}
    </div>
  )
}

export default PostShow