import { useState } from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

const Login = () => {
  let [adminName, setAdminName] = useState('')
  let [password, setPassword] = useState('')
  const router = useRouter()

  return (
    <div
      className='login container'
    >
      <h1>Login</h1>
      <form
        onSubmit={async e => {
          e.preventDefault()
          const res = await fetch(`/api/login`, {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ adminName: adminName, password: password })
          })
          const data = await res.json()
          Cookies.set('token', data.token)
          router.push('/posts/create_post')
        }}
      >
        <label>Admin Name</label>
        <input 
          onInput={e => {
            e.preventDefault()
            setAdminName(e.target.value)
          }}
        />
        <label>Password</label>
        <input 
          onInput={e => {
            e.preventDefault()
            setPassword(e.target.value)
          }}
        />
        <button>Login</button>
      </form>
    </div>
  )
};

export default Login;