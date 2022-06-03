import Sub from '../../models/Sub'
import jwt from 'jsonwebtoken'
import connectDb from '../../lib/mongodb'
import mongoose from 'mongoose'

const Unsubscribe = () => {
  
  return (
    <div
      className='container unsubscribe-container mt-5'
    >
      <h6>You're unsubscribed</h6>
      <p>- Mikowski</p>
    </div>
  )
}

export async function getServerSideProps(context) {
  await connectDb()
  let decoded
  const { subtoken } = context.query

  decoded = jwt.verify(subtoken, process.env.SECRET_KEY)

  await Sub.deleteOne({ _id: mongoose.Types.ObjectId(decoded?.id) })

  return {
    props: {
    },
  }
}

export default Unsubscribe