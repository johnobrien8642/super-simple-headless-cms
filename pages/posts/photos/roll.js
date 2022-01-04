import React from 'react'
import PostShow from '../../components/Post_Show'
import Header from '../../components/Header'

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
      <h1>Photos</h1>
      <div
        className='inner row'
      >
        {data.posts.map((p, i) => {
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
  )
}

export async function getStaticProps() {
  const res = await fetch(`${process.env.URL}/api/photos_get`)
  const data = await res.json()
  
  return { props: { data } }
}

export default Roll