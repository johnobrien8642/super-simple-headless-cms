import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import Logout from '../components/Logout'
import { useRouter } from 'next/router'

const Header = () => {
  let [active, setActive] = useState(false)
  let [active1, setActive1] = useState(false)
  let [active2, setActive2] = useState(false)
  let [active3, setActive3] = useState(false)
  let [active4, setActive4] = useState(false)
  let [loggedIn, setLoggedIn] = useState(false)
  useEffect(() => {
    if (window.localStorage.getItem('loggedIn')) {
      setLoggedIn(true)
    }
  }, [])
  
  const dropdownRef = useRef(null)
  const router = useRouter()
  const pathname = router.pathname
  
  useEffect(() => {
    if (active) {
      dropdownRef.current.focus()
    }

    if (pathname.includes('contact')) {
      setActive2(true)
    } else if (pathname.includes('photos')) {
      setActive3(true)
    } else if (pathname.includes('digital_abstentionism')) {
      setActive4(true)
    } else {
      setActive1(true)
    }
  })

  function reset() {
    setActive1(false)
    setActive2(false)
    setActive3(false)
    setActive4(false)
  }
  
  function handleLoggedIn() {
    if (loggedIn) {
      return Logout()
    }
  }
  
  return (
    <nav
      className='navbar navbar-expand-lg navbar-light bg-light'
    >
      <button
        className='navbar-brand'
        onClick={e => {
          e.preventDefault()
          router.push('/')
        }}
      >
        <h3>John E. O'Brien</h3>
      </button>

      <button 
        className="navbar-toggler" 
        type="button" 
        data-toggle="collapse" 
        data-target="#navbarNav" 
        aria-controls="navbarNav"
        aria-expanded="false" 
        aria-label="Toggle navigation"
        onClick={() => {
          setActive(!active)
        }}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div
        id='navbarNav'
        className={`${active ? 'active ' : 'collapse '}navbar-collapse bg-light`}
        tabIndex={-1}
        ref={dropdownRef}
        onBlur={e => {
          if (!e.relatedTarget) {
            setActive(false)
          }
        }}
      >
        <ul
          className='navbar-nav'
        >
          <li
            className={`${active1 ? 'active ' : ''}nav-item`}
            onClick={() => {
              reset()
              setActive1(true)
            }}
          >
            <Link
              href='/'
              passHref
            >
              <a
                className='nav-link'
              >
                Hi
              </a>
            </Link>
          </li>
          <li
            className={`nav-item${active3 ? ' active' : ''}`}
            onClick={() => {
              reset()
              setActive3(true)
            }}
          >
            <Link
              href='/posts/photos/roll'
              className='nav-link'
              passHref
            >
              <a
                className='nav-link'
              >
                Pictures
              </a>
            </Link>
          </li>
          {/* <li
            className={`nav-item${active4 ? ' active' : ''}`}
            onClick={() => {
              reset()
              setActive4(true)
            }}
          >
            <Link
              href='/pieces/roll'
              className='nav-link'
              passHref
            >
              <a
                className='nav-link'
              >
                Pieces
              </a>
            </Link>
          </li> */}
          <li>
            {handleLoggedIn()}
          </li>
          {/* Some day soon I'll uncomment this, right after
          I finish my first book */}
          {/* <li
            className='nav-item'
          >
            <Link
              href='/posts/books/roll'
              >
              <a
                className='nav-link'
              >
                Books
              </a>
            </Link>
          </li> */}
        </ul>
      </div>
    </nav>
  )
};

export default Header;