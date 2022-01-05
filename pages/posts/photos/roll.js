import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import PostShow from '../../components/Post_Show'
import Header from '../../components/Header'
import connectDb from '../../../lib/mongodb'
import Post from '../../../models/Post'

const Roll = ({ data }) => {
  const router = useRouter()
  const href = process.env.URL + router.asPath

  function handleRowDivider(p , i) {
    let i2 = 0
    i2 += (i + 1)
    if (i2 % 2 === 0) {
      return <div key={p._id} className='w-100'></div>
    }
  }

  return (
    <React.Fragment>
      <Head>
        <link rel='canonical' href={href} />
      </Head>
      <Header />
      <div
        className='roll container'
      >
        <h1>Photos</h1>
        <div
          className='inner row'
        >
          {data.posts?.map((p, i) => {
              return (
                <React.Fragment
                  key={p._id}
                >
                  <PostShow post={p} />
                  {handleRowDivider(p, i)}
                </React.Fragment>
              )
          })}
        </div>
      </div>
    </React.Fragment>
  )
}

export async function getStaticProps() {
  await connectDb()
  const posts = await Post
    .find({
      type: 'Photo'
    })

  return { props: { data: posts } }
}

export default Roll