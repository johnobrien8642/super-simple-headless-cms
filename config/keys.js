const keys = {
  url: process.env.NODE_ENV === 'development' ?  `http://localhost:${process.env.PORT}` : `http://127.0.0.1:80`
}

export default keys