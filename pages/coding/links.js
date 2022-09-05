import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import Head from 'next/head'
import Header from '../components/Header'
import { useRouter } from 'next/router'
import keys from '../../config/keys'

const CodingLinks = () => {
    const router = useRouter()
    const href = keys.url + router.asPath
    let loggedIn = useRef('')

    useEffect(() => {
      if (window.localStorage.getItem('loggedIn')) {
        loggedIn.current = true
      }
    })

    return (
      <React.Fragment>
        <Header loggedIn={loggedIn.current} />
        <div
          className='coding-links-container container my-5'
        >
          <Head>
            <title>John E. O'Brien Developer Links</title>
            <meta name='description' content="My links for Github and Stack Overflow." />
            <link rel='canonical'  href={href}/>
          </Head>
          <h1>Developer Links</h1>
          <div
            className='inner mt-5'
          >
            <a
              href='https://github.com/johnobrien8642'
            >
              <Image
                width='400'
                height='400'
                src='/Github-Mark.png'
              ></Image>
            </a>
            <a
              href='https://stackoverflow.com/users/13836220/john-obrien'
            >
              <Image
                width='400'
                height='400'
                src='/768px-Stack_Overflow_icon.svg.png'
              ></Image>
            </a>
          </div>
        </div>
      </React.Fragment>
    )
}

export default CodingLinks