import PostShow from '../../components/Post_Show'
import Header from '../../components/Header'
import connectDb from '../../../lib/mongodb'
import Post from '../../../models/Post'
import React from 'react'

const Roll = ({ data }) => {

  function handleRowDivider(p , i) {
    let i2 = 0
    i2 += (i + 1)
    if (i2 % 2 === 0) {
      return <div key={p._id} className='w-100'></div>
    }
  }

  return (
    <React.Fragment>
      <Header />
      <div
        className='roll container'
      >
        <h1>Books</h1>
        {data.posts?.map(p => {
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
    </React.Fragment>
  )
}

export async function getStaticProps() {
  await connectDb()
  const posts = await Post
    .find({
      type: 'Book'
    })

  return { props: { data: posts } }
}

export default Roll