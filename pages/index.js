import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Header from './components/Header'
import PostShow from './components/Post_Show'
import connectDb from '../lib/mongodb'
import Post from '../models/Post'
import { useRouter } from 'next/router'

export default function Home({ data }) {
  let [active, setActive] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      setActive(true)
    }, 500)
  })

  return (
    <React.Fragment>
      <Header />
      <div className={`${active ? 'active ' : ''}main-page container`}>
        <Head>
          <title>John O'Brien Personal Site</title>
          {/* <link rel="icon" href="/favicon.ico" /> */}
        </Head>

        <div
          className='index-container'
        >
          <h1 className='h1'>Hello</h1>
          <p>
            Hi, my name's John. Welcome. I'm on a mission to create art
            that's meant to only be experienced in its physical form. I even created
            an entire moral philosophy about this that I attempt to live and create by. 
            The philosophy is called Digital Abstentionism, and if you're interested
            you can read about it <button onClick={e => {e.preventDefault(), router.push('/digital_abstentionism')}}>here</button>
          </p>
          <p>
            All of my photographic prints tell a story. They're still-lifes done in photographic
            style. The ones here on this website are here because I'm done enjoying them,
            and now I'm ready to let someone else enjoy them. They're only ever printed and framed 
            once, with the promise that I've destroyed the original file copy.
          </p>
          <p>
            I do have a contact email here, where you can get in contact with
            me. If you're interested in purchasing any of the pieces you can reference
            the piece number in the email when you inquire about it. The piece number 
            is above the title, and below the image.
          </p>
          <p>
            Wherever you are and whatever you're doing, I hope you're at least
            thinking for yourself.
          </p>
        </div>

        <PostShow post={data?.randPost} />

        <footer>
        </footer>
      </div>
    </React.Fragment>
  )
}

export async function getServerSideProps() {
    await connectDb()
    const posts = await Post
      .find({})
    const rand = Math.floor(Math.random() * posts.length)
    const randPost = posts[rand]

    return {
      props: { data: JSON.stringify(randPost) },
    }
}
