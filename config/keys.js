const keys = {
  url: process.env.NODE_ENV === 'development' ?  `http://localhost:${process.env.PORT}` : `http://localhost:${process.env.VERCEL_PORT}`
}

export default keys