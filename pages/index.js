import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Header from './components/Header'
import PostShow from './components/Post_Show'
import keys from '../config/keys'
import connectDb from '../lib/mongodb'
import Post from '../models/Post'
import Admin from '../models/Admin'
import Logout from './components/Logout'
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
          <title>John E. O'Brien</title>
          {/* <link rel="icon" href="/favicon.ico" /> */}
          <meta name='description' content="A place for my visual art." />
          <link rel='canonical'  href={href}/>
        </Head>

        <div
          className='index-container'
        >
          <p>
            My name's John, and this is a website where I post all of my visual art.
          </p>
          <p>
            johnedwardobrienartist@gmail.com
          </p>
        </div>

        <PostShow post={JSON.parse(randPost)} loggedIn={loggedIn ? true : false} />

        <footer>
        </footer>
      </div>
    </React.Fragment>
  )
}

export async function getServerSideProps(context) {
    await connectDb()
    let decoded
    
    const posts = await Post
      .find({})
    
    const rand = Math.floor(Math.random() * posts.length)
    const randPost = posts[rand]

    if (context.req.cookies.token) {
      decoded = jwt.verify(context.req.cookies.token, process.env.SECRET_KEY)
    }
    const authenticated = await Admin
      .findById(decoded?.id)
    
    return {
      props: { loggedIn: !!authenticated, randPost: randPost ? JSON.stringify(randPost) : null },
    }
}
