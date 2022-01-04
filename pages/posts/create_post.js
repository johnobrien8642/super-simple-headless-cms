import { useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Form from '../components/Form'
import AuthUtil from '../util/auth_util'
const { asyncAuthenticate } = AuthUtil

const CreatePost = ({ data }) => {
  const router = useRouter()
  
  useEffect(() => {
    if (!data.authenticated) {
      router.push('/admin')
    }
  }, [])
  
  return (
    <div
    className='create-post-container container'
    >
      <Link
        href={'/admin'}
      >
        Admin Page
      </Link>
      <Link
        href={'/'}
      >
        Main Page
      </Link>
      <Form />
    </div>
  )
}

export async function getServerSideProps(context) {
  const data = await asyncAuthenticate(context.req?.cookies)
  return {
    props: {
      data,
    },
  }
}

export default CreatePost