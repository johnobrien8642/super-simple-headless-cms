import React, { useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import Form from '../components/Form'
import connectDb from '../../lib/mongodb'
import Admin from '../../models/Admin'
import jwt from 'jsonwebtoken'

const CreatePost = ({ data }) => {
  const router = useRouter()
  
  useEffect(() => {
    if (!data) {
      router.push('/admin')
    }
  }, [])
  
  return (
    <React.Fragment>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
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
    </React.Fragment>
  )
}

export async function getServerSideProps(context) {
  await connectDb()
  const decoded = jwt.verify(context.req.cookies.token, process.env.SECRET_KEY)
  const authenticated = await Admin
    .findById(decoded.id)

  return {
    props: {
      data: !!authenticated,
    },
  }
}

export default CreatePost