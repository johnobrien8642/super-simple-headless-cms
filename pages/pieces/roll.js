import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import connectDb from '../../lib/mongodb'
import Header from '../components/Header'
import Piece from '../../models/Piece'
import Admin from '../../models/Admin'
import { useRouter } from 'next/router'
import keys from '../../config/keys'
import jwt from 'jsonwebtoken'

const Roll = ({ data }) => {
  let [toggle, toggleSections] = useState(false)
  const router = useRouter()
  const path = keys.url + router.asPath
  const { loggedIn, pieces } = data
  
  function handleRowDivider(p , i) {
    let i2 = 0
    i2 += (i + 1)
    if (i2 % 2 === 0) {
      return <div key={p._id} className='w-100'></div>
    }
  }

  function handleSection(s) {
    return s.sectionNumber + (s.title ? ` - ${s.title}` : '')
  }

  function handleAdminLinks(loc, obj1, obj2) {
    if (loggedIn) {
      if (loc === 'addNewPiece') {
        return (
          <Link
            href={{ pathname: '/piece/add_or_update', query: { update: false } }}
          >
            Add New Piece
          </Link>
        )
      }
      if (loc === 'addSection') {
        return (
          <Link
            href={{ pathname: `/piece/section/add_or_update`, query: { update: false, pieceId: obj1._id, sectionLength: obj1.sections.length + 1 }}}
          >
            <a className='add-section-link my-1'>Add Section</a>
          </Link>
        )
      }
      if (loc === 'editSection') {
        return (
          <Link
            href={{ pathname: `/piece/section/add_or_update`, query: { update: true, pieceId: obj1._id, sectionId: obj2._id } }}
          >
            <a className='section-edit-link'>Edit</a>
          </Link>
        )
      }
    }
  }
  
  return (
    <React.Fragment>
      <Head>
        <link rel='canonical' href={path} />
      </Head>
      <Header loggedIn={loggedIn} />
      <div
        className='roll container pieces-container'
      >
        {handleAdminLinks('addNewPiece')}
        <h1>Pieces</h1>
        {JSON.parse(pieces)?.map((p, i) => {
          return (
            <React.Fragment
              key={p._id}
            >
              <div
                className='piece-container my-3'
              >
                <h3
                  onClick={() => {
                    toggleSections(!toggle)
                  }}
                >
                  {p.title}
                </h3>
                {handleAdminLinks('addSection', p)}
                <div
                  className={`sections-container my-1${toggle ? ' open' : ''}`}
                >
                  {p.sections.map(s => {
                    return (
                      <div
                        className='section-container my-1'
                        key={s._id}
                      >
                        <Link href={{ pathname: '/piece/section', query: { sectionId: s._id }}}>
                          {handleSection(s)}
                        </Link>
                        {handleAdminLinks('editSection', p, s)}
                      </div>
                    )
                  })}
                </div>
              </div>
              {handleRowDivider(p, i)}
            </React.Fragment>
          )
        })}
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

  const pieces = await Piece
    .find({})
    .populate('sections')

  const authenticated = await Admin
    .findById(decoded?.id)

  return {
    props: {
      data: { loggedIn: !!authenticated, pieces: JSON.stringify(pieces) },
    },
  }
}

export default Roll