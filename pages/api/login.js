import bcrypt from 'bcryptjs'
import dbConnect from '../../lib/mongodb.js'
import Admin from '../../models/Admin'
import jwt from 'jsonwebtoken'

export default async (req, res) => {
  await dbConnect()
  
  const admin = await Admin
    .findOne({
      adminName: req.body.adminName
    })
  
  const authenticated = await bcrypt.compare(req?.body?.password, admin?.password)
  
  if (admin && authenticated) {
    const token = jwt.sign({ id: admin._id }, process.env.SECRET_KEY)
    res.status(200).json({ token: token })
  } else {
    res.json(new Error('Email or password incorrect'))
  }
}