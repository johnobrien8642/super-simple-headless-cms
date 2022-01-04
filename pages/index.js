import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Header from './components/Header'
import PostShow from './components/Post_Show'
import connectDb from '../lib/mongodb'
import Post from '../models/Post'

export default function Home({ data }) {
  let [active, setActive] = useState(false)

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
            that never ends up on the internet. I create photography
            prints, only ever printed once, in a limited batch, first enjoyed
            by me, and then made available for purchase. I order printings of 
            my books. I make everything available for purchase, either directly
            from me in person, or shipped to wherever you are.
          </p>
          <p>
            I don't have any social media. If you like what you see and
            would like to check in with me, then I'd recommend bookmarking
            this page.
          </p>
          <p>
            I do have a contact email here, where you can get in contact with
            me.
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
