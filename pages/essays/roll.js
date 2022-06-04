import React, { useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import connectDb from '../../lib/mongodb'
import Header from '../components/Header'
import Essay from '../../models/Essay'
import Admin from '../../models/Admin'
import { useRouter } from 'next/router'
import keys from '../../config/keys'
import jwt from 'jsonwebtoken'

const Roll = ({ data }) => {
  let [toggle, toggleSections] = useState([])
  let [warn, setWarn] = useState('')
  const router = useRouter()
  const path = keys.url + router.asPath
  const { loggedIn, pieces } = data
  
  // const { update, writingId, title, summary, finished } = router.pathname
  
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
      if (loc === 'editPiece') {
        return (
          <Link
            href={{ pathname: '/essay/add_or_update', query: { update: true, writingId: obj1._id, title: obj1.title, summary: obj1.summary, finished: obj1.finished, type: 'essay' } }}
          >
            <a>Edit essay</a>
          </Link>
        )
      }
      if (loc === 'addNewPiece') {
        return (
          <Link
            href={{ pathname: '/essay/add_or_update', query: { update: false, type: 'essay' } }}
          >
            Add New Essay
          </Link>
        )
      }
      if (loc === 'addSection') {
        return (
          <Link
            href={{ pathname: `/essay/section/add_or_update`, query: { update: false, writingId: obj1._id, sectionLength: obj1.sections.length + 1, type: 'essay' }}}
          >
            <a className='add-section-link my-1'>Add Section</a>
          </Link>
        )
      }
      if (loc === 'editSection') {
        return (
          <Link
            href={{ pathname: `/essay/section/add_or_update`, query: { update: true, writingId: obj1._id, sectionId: obj2._id, type: 'essay' } }}
          >
            <a className='section-edit-link'>Edit</a>
          </Link>
        )
      }
    }
  }

  function handleDeleteButton(loggedIn, loc, _id) {
    let endpoint = loc === 'title' ? '/api/writing/add_or_update' : '/api/writing/section/add_or_update'
    
    function handleCancel() {
      if (warn === _id) {
        return (
          <React.Fragment>
            <button
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                setWarn('')
              }}
            >
              Cancel Delete
            </button>
            <button
              onClick={e => {
                e.stopPropagation()
              }}
            >
              Confirm Delete
            </button>
          </React.Fragment>
        )
      }
    }

    if (loggedIn) {
      return (
        <div
          className='delete-button-container ms-2'
        >
          <form
            onSubmit={async (e) => {
              e.preventDefault()
              const res = await fetch(endpoint, {
                method: 'POST',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  deleteBool: true,
                  _id,
                  type: 'essay'
                })
              })
              const returnedData = await res.json()
              if (res.ok) {
                window.location.reload()
              } else {
                console.log('Error in essays/roll', returnedData.errorMessage)
              }
            }}
          >
            <button
              className={`main-delete-btn${warn === _id ? ' hide' : ''}`}
              onClick={e => {
                e.preventDefault()
                e.stopPropagation()
                setWarn(_id)
              }}
            >
              Delete
            </button>
            <p className={`mx-1 warning${warn === _id ? ' show' : ''}`}>Confirm delete? Click again, or cancel</p>
            {handleCancel()}
          </form>
        </div>
      )
    }
  }
  
  return (
    <React.Fragment>
      <Head>
        <title>Essays</title>
        <meta name='description' content='All essays by Mikowski in their entirety, available to read.' />
        <link rel='canonical' href={path} />
      </Head>
      <Header loggedIn={loggedIn} />
      <div
        className='roll container pieces-container'
      >
        <div
          className='explainer'
        >
          <span>F = Finished</span>
          <span>O = Ongoing</span>
        </div>
        {handleAdminLinks('addNewPiece')}
        {JSON.parse(pieces)?.map((p, i) => {
          return (
            <React.Fragment
              key={p._id}
            >
              <div
                className='piece-container my-3'
              >
                <div
                  className='header-container'
                >
                  <h3
                    onClick={() => {
                      if (toggle.includes(p._id.toString())) {
                        toggle.splice(toggle.findIndex(_id => _id.toString() === p._id.toString()), 1)
                        toggleSections([...toggle])
                      } else {
                        toggleSections(toggle.concat(p._id.toString()))
                      }
                    }}
                  >
                    {p.title}
                    {handleDeleteButton(loggedIn, 'title', p._id)}
                  </h3>
                  <sup>{p.finished ? 'F' : 'O'}</sup>
                  {handleAdminLinks('editPiece', p)}
                </div>
                <h6>{p.summary}</h6>
                {handleAdminLinks('addSection', p)}
                <div
                  className={`sections-container my-1${toggle.includes(p._id.toString())? ' open' : ''}`}
                >
                  {p.sections.map(s => {
                    return (
                      <div
                        className='section-container my-1'
                        key={s._id}
                      >
                        <Link href={{ pathname: '/essay/section', query: { sectionId: s._id }}}>
                          {handleSection(s)}
                        </Link>
                        {handleAdminLinks('editSection', p, s)}
                        {handleDeleteButton(loggedIn, 'section', s._id)}
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

  const pieces = await Essay
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