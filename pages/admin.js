import React from 'react'
import Link from 'next/link'
import Login from './components/Login'
import Logout from './components/Logout'
import NewAdmin from './components/New_Admin'
import AuthUtil from './util/auth_util.js'
import connectDb from '../lib/mongodb'
import Admin from '../models/Admin'
import jwt from 'jsonwebtoken'
const { asyncAuthenticate } = AuthUtil

const AdminPage = ({ authenticated }) => {
  function handleComponents() {
    if (authenticated) {
      return (
        <React.Fragment>
          <Logout />
          <NewAdmin />
          <Link
            href={'/posts/create_post'}
          >
            Create Post
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
  const decoded = jwt.verify(context.req.cookies, process.env.SECRET_KEY)
  const authenticated = await Admin
    .findById(decoded.id)

  return {
    props: {
      authenticated,
    },
  }
}

export default AdminPage;