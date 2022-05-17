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
          <title>Mikowski</title>
          {/* <link rel="icon" href="/favicon.ico" /> */}
          <meta name='description' content="Do you like good writing and cool pictures? Hi, my name's Mikowski, this is my website, I host everything here for free." />
          <link rel='canonical'  href={href}/>
        </Head>

        <div
          className='index-container'
        >
          <h1 className='h1'>Hello</h1>
          <p>
            Hello. My name's Mikowksi. You can find all of my writing pieces here for
            free. You can also find all of my photography.
          </p>
          <p>
            Mikowski is my artist's pseudonym. The only way you'll ever find anything
            out about me is by reading my writing. I doubt you'll find anything out
            about me by looking at my pictures, but I do enjoy taking pictures, so 
            I do hope you enjoy those.
          </p>
          <p>
            I do have an email that I'm going to put here out of my own curiosity.
          </p>
          <p>
            mikowski.me@protonmail.com
          </p>
          <p>
            Message about whatever you like. No guarantees I'll get back.
          </p>
        </div>

        <PostShow post={JSON.parse(randPost)} />

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
