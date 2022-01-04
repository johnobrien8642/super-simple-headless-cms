import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

function Header() {
  let [active, setActive] = useState(false)
  let [active1, setActive1] = useState(false)
  let [active2, setActive2] = useState(false)
  let [active3, setActive3] = useState(false)
  let [active4, setActive4] = useState(false)

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
        <h3>John Edward O'Brien</h3>
        <p>Prints, Writing, Podcasting</p>
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
        // onBlur={e => {
        //   if (!e.relatedTarget) {
        //     setActive(false)
        //   }
        // }}
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
              >
              <a
                className='nav-link'
              >
              About
              </a>
            </Link>
          </li>
          <li
            className={`${active2 ? 'active ' : ''}nav-item`}
            onClick={() => {
              reset()
              setActive2(true)
            }}
          >
            <Link
              href='/contact'
            >
              <a
                className='nav-link'
              >
                Contact
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
            >
              <a
                className='nav-link'
              >
                Prints
              </a>
            </Link>
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
          <li
            className='nav-item'
            onClick={() => {
              reset()
              setActive4(true)
            }}
          >
            <Link
              href='https://www.patreon.com/sindicated'
            >
              <a
                className='nav-link'
              >
                Patreon
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  )
};

export default Header;