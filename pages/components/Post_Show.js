import Image from 'next/image'
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
  
  if (post) {
    return (
      <div
        className='post-show col-md'
      >
        <Image 
          width='1200' 
          height='800' 
          objectFit='contain' 
          className='w-100' 
          src={post?.link} 
          alt='post image'
          placeholder='blur'
          blurDataURL={Buffer.from(post.blurString)}
        />
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
  } else {
    return (
      <div
        className='post-show col-md'
      >
        <p>Sorry, no photos to show yet</p>
      </div>
    )
  }
}

export default PostShow