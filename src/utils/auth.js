import config from '../config'
import { User } from '../resources/user/user.model'
import jwt from 'jsonwebtoken'

export const newToken = user => {
  return jwt.sign({ id: user.id }, config.secrets.jwt, {
    expiresIn: config.secrets.jwtExp
  })
}

export const verifyToken = token =>
  new Promise((resolve, reject) => {
    jwt.verify(token, config.secrets.jwt, (err, payload) => {
      if (err) return reject(err)
      resolve(payload)
    })
  })

export const signup = async (req, res) => {
  const { email } = req.body
  const { password } = req.body

  if (!email || !password)
    return res.status(400).send({ message: 'Email & Password are required' })
  // create user in try/catch because user creation may fail.
  try {
    const user = await User.create(req.body)
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (e) {
    console.log(e)
    return res.status(400).end()
  }
}

export const signin = async (req, res) => {
  const { email } = req.body
  const { password } = req.body

  if (!email || !password)
    return res.status(400).send({ message: 'Email & Password are required' })

  const user = await User.findOne({ email: email })

  if (!user) return res.status(401).send({ message: 'Not user found' })

  try {
    const match = await user.checkPassword(password)
    if (!match) {
      return res.status(401).send({ message: 'Not auth user' })
    }
    const token = newToken(user)
    return res.status(201).send({ token })
  } catch (error) {
    console.log(error)
    return res.status(400).send({ message: 'Not auth user' })
  }
}

export const protect = async (req, res, next) => {
  if (!req.headers.authorization) return res.status(401).end()

  let token = req.headers.authorization.split('Bearer ')[1]

  if (!token) return res.status(401).end()

  try {
    const payload = await verifyToken(token)
    const user = await User.findById(payload.id)
      .select('-password')
      .lean() // convert mongoose object data to raw javascript
      .exec()
    req.user = user
  } catch (error) {
    console.log(error)
    return res.status(401).end()
  }
  next()
}
