const keys = {
  url: process.env.NODE_ENV === 'development' ?  `http://localhost:${process.env.PORT}` : `http://www.johnedwardobrien.com`
}

export default keys