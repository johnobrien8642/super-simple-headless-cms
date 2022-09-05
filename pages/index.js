import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from './components/Header'
import keys from '../config/keys'
import connectDb from '../lib/mongodb'
import Admin from '../models/Admin'
import Logout from './components/Logout'
import SubscribeForm from './components/Subscribe_Form'
import { useRouter } from 'next/router'
import jwt from 'jsonwebtoken'

export default function Home({ data, loggedIn, randPost }) {
  let [active, setActive] = useState(false)
  const router = useRouter()
  const href = keys.url + router.asPath
  
  useEffect(() => {
    setTimeout(() => {
      setActive(true)
    }, 500)
    if (loggedIn) {
      window.localStorage.setItem('loggedIn', 'true');
    } else {
      if (window.localStorage.getItem('loggedIn')) {
        window.localStorage.removeItem('loggedIn')
      }
    }
  })
  
  return (
    <React.Fragment>
      <Header loggedIn={loggedIn} />
      <div className={`${active ? 'active ' : ''}main-page container`}>
        <Head>
          <title>John E. O'Brien</title>
          {/* <link rel="icon" href="/favicon.ico" /> */}
          <meta name='description' content="A writer and musician who also likes to take a picture or two when travelling." />
          <link rel='canonical'  href={href}/>
        </Head>

        <div
          className='index-container'
        >
          <p>
            My name's John, and I'm a writer, musician, and sometimes I take pictures, usually
            when I'm travelling. I created this website to share my work. You can find links to
            my writing and pictures above.
          </p>
          <p>
            johnedwardobrienartist@gmail.com
          </p>
          <SubscribeForm />
          <div
            className='bottom-links'
          >
            <Link
              href='/pieces/roll'
              className='nav-link'
              passHref
            >
              <a
                className='pieces-link'
              >
                Writing
              </a>
            </Link>
          <Link
              href='/photos/roll'
              className='nav-link'
              passHref
            >
              <a
                className='pieces-link'
              >
                Pictures
              </a>
            </Link>
          </div>
        </div>
      </div>
    </React.Fragment>
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
      props: { loggedIn: !!authenticated },
    }
}
