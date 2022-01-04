import { useRouter } from 'next/router'
import PostShow from '../components/Post_Show'
import Header from '../components/Header'
import keys from '../../config/keys'
import connectDb from '../../lib/mongodb.js'
import Post from '../../models/Post'

function Post({ post }) {
  const router = useRouter()

  return (
    <div
      className='single-post-show container'
    >
      <Header />
      <button
        className='go-back-btn'
        onClick={e => {
          e.preventDefault()
          const path = post.type === 'Photo' ? 'photos' : 'books'
          router.push(`/posts/${path}/roll`)
        }}
      >
        Go back
      </button>
      <PostShow post={post} single={true} />
    </div>
  )
}

export async function getStaticPaths() {
  // const res = await fetch(`${keys.url}/api/photos_get`)
  // const data = await res.json()
  const posts = await Post
    .find({})

  const paths = posts.map((post) => ({
    params: { id: post._id },
  }))
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  // const res = await fetch(`${keys.url}/api/photo_get?id=${params.id}`)
  // const data = await res.json()

  const post = await Post
    .findById(params.id)

  return { props: { post } }
}

export default Post