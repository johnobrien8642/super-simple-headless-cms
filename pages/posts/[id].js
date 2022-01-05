import Head from 'next/head'
import { useRouter } from 'next/router'
import PostShow from '../components/Post_Show'
import Header from '../components/Header'
import keys from '../../config/keys'
import connectDb from '../../lib/mongodb.js'
import Post from '../../models/Post'

function SinglePost({ data }) {
  const router = useRouter()
  const path = keys.url = router.asPath

  return (
    <div
      className='single-post-show container'
    >
      <Head>
        <link rel='canonical' href={path} />
      </Head>
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
  // const res = await fetch(`${keys.url}/api/photos_get`)
  // const data = await res.json()
  await connectDb()
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
  await connectDb()
  const post = await Post
    .findById(params.id)

  return { props: { data: JSON.stringify(post) } }
}

export default SinglePost