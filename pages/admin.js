import React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Login from './components/Login'
import Logout from './components/Logout'
import NewAdmin from './components/New_Admin'
import connectDb from '../lib/mongodb'
import Admin from '../models/Admin'
import jwt from 'jsonwebtoken'

const AdminPage = ({ data }) => {
  function handleComponents() {
    if (data) {
      return (
        <React.Fragment>
          <Head>
            <meta name="robots" content="noindex,nofollow" />
          </Head>
          <Logout />
          <NewAdmin />
          <Link
            href={'/posts/create_post'}
          >
            Create Post
          </Link>
          <Link
            href={'/posts/sympathy_exchange'}
          >
            Create Sympathy Item
          </Link>
          <Link
            href={'/pieces/roll'}
          >
            Create Writing
          </Link>
          <Link
            href={'/'}
          >
            Main Page
          </Link>
        </React.Fragment>
      )
    } else {
      return (
        <React.Fragment>
          <Login />
        </React.Fragment>
      )
    }
  }

  return (
    <div
      className='admin-container container'
    >
      {handleComponents()}
    </div>
  )
}

export async function getServerSideProps(context) {
  await connectDb()
  let decoded
  if (context.req.cookies.token) {
    decoded = jwt.verify(context.req.cookies.token, process.env.SECRET_KEY)
  }
  const authenticated = await Admin
    .findById(decoded?.id)

  return {
    props: {
      data: !!authenticated,
    },
  }
}

export default AdminPage;