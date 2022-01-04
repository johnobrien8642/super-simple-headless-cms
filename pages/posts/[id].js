import { useRouter } from 'next/router'
import PostShow from '../components/Post_Show'
import Header from '../components/Header'
import keys from '../../config/keys'

function Post({ data }) {
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
          const path = data.post.type === 'Photo' ? 'photos' : 'books'
          router.push(`/posts/${path}/roll`)
        }}
      >
        Go back
      </button>
      <PostShow post={data.post} single={true} />
    </div>
  )
}

export async function getStaticPaths() {
  const res = await fetch(`${keys.url}/api/photos_get`)
  console.log(keys)
  console.log(res)
  const data = await res.json()
  const paths = data.posts.map((post) => ({
    params: { id: post._id },
  }))
  return { paths, fallback: false }
}

export async function getStaticProps({ params }) {
  const res = await fetch(`${keys.url}/api/photo_get?id=${params.id}`)
  console.log(res)
  const data = await res.json()
  return { props: { data } }
}

export default Post