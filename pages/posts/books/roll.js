import PostShow from '../../components/Post_Show'
import Header from '../../components/Header'
import connectDb from '../../../lib/mongodb'
import Post from '../../../models/Post'

const Roll = ({ data }) => {

  function handleRowDivider(p , i) {
    let i2 = 0
    i2 += (i + 1)
    if (i2 % 2 === 0) {
      return <div key={p._id} className='w-100'></div>
    }
  }

  return (
    <div
      className='roll container'
    >
      <Header />
      <h1>Books</h1>
      {data.posts.map(p => {
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