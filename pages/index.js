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
  })
  
  return (
    <React.Fragment>
      <Header loggedIn={loggedIn} />
      <div className={`${active ? 'active ' : ''}main-page container`}>
        <Head>
          <title>Mikowski</title>
          {/* <link rel="icon" href="/favicon.ico" /> */}
          <meta name='description' content="I'm a writer writing under the pseudonym Mikowski. My work spans from fiction pieces, to philosophy. I post everything here for free, tell your friends." />
          <link rel='canonical'  href={href}/>
        </Head>

        <div
          className='index-container'
        >
          <p>
            Hello, my name's Mikowski. I post all of my writing here for free, find the links
            to them above or below.
          </p>
          <p>
            My email: mikowski.me@protonmail.com
          </p>
          <p>
            Unserious inquiries only, please.
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
                Pieces
              </a>
            </Link>
          <Link
              href='/essays/roll'
              className='nav-link'
              passHref
            >
              <a
                className='pieces-link'
              >
                Essays
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
