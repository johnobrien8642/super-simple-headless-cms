import React from 'react'
import Head from 'next/head'
import Header from './components/Header'
import { useRouter } from 'next/router'
import keys from '../config/keys'

const Contact = () => {
  const router = useRouter()
  const path = keys.url + router.asPath

  return (
    <React.Fragment>
      <Head>
        <link rel='canonical' href={path} />
      </Head>
      <Header />
      <div
        className='contact container'
      >
        <div
          className='contact container'
        >
          <p>My email is johnedwardobrienartist@gmail.com</p>
          <p>
            If you're interested in purchasing one of my pieces send me an email
            with the number of the image you're interested in. The number of the image
            can be found just below the image and just above the title. I'll get back
            to you shortly.
          </p>
          <p>
            For non-purchasing related inquiries feel free to send me an email. Whether
            or not I get back to you I can't say, but I might.
          </p>
        </div>
      </div>
    </React.Fragment>
  )
}

export default Contact