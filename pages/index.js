import React, { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Header from './components/Header'
import keys from '../config/keys'
import connectDb from '../lib/mongodb'
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
          <meta name='description' content="I'm a writer writing under the pseudonym Mikowski. My work spans from fiction pieces, to philosophy. I post everything here for free, tell your friends." />
          <link rel='canonical'  href={href}/>
        </Head>

        <div
          className='index-container'
        >
          <p>
            I'll introduce myself as Mikowski. This is not my real name, but this is the only name
            you'll need to know me by. In this world, anonymity is the new ideal. I never plan on
            revealing my actual God-given identity, birthname, history, age... especially age, who 
            needs to know someone's age? I propose we go back to a world where you don't know someone's
            age, and don't want to know. What are we all doing in this life, counting the seconds
            until we must die? Pathetic.
          </p>
          <p>
            What do I write about? Well, that's a very large question that I'm terrible at answering. I
            will tell you what kind of writing that I personally do enjoy.
          </p>
          <p>
            I like writing that makes you feel like the characters you just read were actual real people.
          </p>
          <p>
            I like writing with a sense of humor, and by extension, the writers. If I make a mistake and buy
            humorless writing, I throw it into the garbage.
          </p>
          <p>
            I like writing where descriptions of events, places, characters, and interactions, are completely
            to the point, and only poetic through undeniability. What I mean by undeniably poetic is that the
            writing is still legible, and understandable, but also through the talent and skill of the writer
            takes on a feeling of poetry. This is in contrast to writers who try to write prose as poetry,
            which I personally don't like.
          </p>
          <p>
            I don't like post-modernism, or a writer trying to become personally famous. I think these are one
            in the same. Post-modernism, to me, is mostly just public self-flagellation mixed with public
            indecency of the naked-under-the-trenchcoat-with-a-hardon kind. You know what I mean.
          </p>
          <p>
            Speaking of which, writing shouldn't be masturbatory, it should birth something new. I like when
            that happens.
          </p>
          <p>
            I do have an email below here:
          </p>
          <p>
            mikowski.me@protonmail.com
          </p>
          <p>
            First of all, yes, email me with typos if you find them. I do all of my own proof-reading, editing
            etc because I'm not paying people a bunch of money to post writing onto my own damn website for free.
            And besides, no one tells me how to write, what to write, what not to write. The best way to get me to
            write a certain way, actually, is to tell me how/what to write with the intention of getting me to write
            the opposite, because I'll probably do so, just to spite you. Freedom is a quantity in limited supply
            these days, despite what the world appears to be.
          </p>
          <p>
            I know I'm going to regret putting this email here, but I can't help myself. If I ever
            become successful then a bunch of people are going to inundate my email, and then I'll
            never be able to write again because of how engrossed I'll be in the interactions, which will
            most certainly range from cogent to insane. But, alas, this is the internet, and I'll repeat,
            I just can't help myself. And besides, how presumptuous and egotistical of me to assume
            that I'd become successful?
          </p>
          <Link
              href='/pieces/roll'
              className='nav-link'
              passHref
            >
              <a
                className='nav-link my-auto'
              >
                Pieces
              </a>
            </Link>
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
