const Roll = ({ data }) => {

  return (
    <div
      className='roll container'
    >
      {data.posts.map(p => {
        return <PostShow post={p} />
      })}
    </div>
  )
}

export async function getStaticProps(context) {
  const res = await fetch(`${process.env.URI}/api/photos_get`)
  const data = await res.json()

  if (!data) {
    return {
      notFound: true,
    }
  }

  return {
    props: { data }, // will be passed to the page component as props
  }
}

export default Roll