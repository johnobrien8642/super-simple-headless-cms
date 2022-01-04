async function asyncAuthenticate(cookies) {
  if (cookies?.token) {
    const res = await fetch(`${process.env.URL}/api/authenticate`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ token: cookies.token })
    })
    return res.json()
  } else {
    return { authenticated: false }
  }
}

const AuthUtil = {
  asyncAuthenticate
}

export default AuthUtil