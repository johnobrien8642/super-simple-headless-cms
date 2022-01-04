const keys = {
  url: process.env.NODE_ENV === 'development' ?  `http://localhost:${process.env.PORT}` : `http://localhost:80`
}

export default keys