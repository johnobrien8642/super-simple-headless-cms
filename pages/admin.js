import React from 'react'
import Link from 'next/link'
import Login from './components/Login'
import Logout from './components/Logout'
import NewAdmin from './components/New_Admin'
import AuthUtil from './util/auth_util.js'
const { asyncAuthenticate } = AuthUtil

const Admin = ({ data }) => {
  function handleComponents() {
    if (data.authenticated) {
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
  const data = await asyncAuthenticate(context.req?.cookies)
  return {
    props: {
      data,
    },
  }
}

export default Admin;