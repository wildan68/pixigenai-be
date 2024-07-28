import express from 'express'
import { encrypt, decrypt, hashPassword, generateKey, isAdmin, limiter } from '../utils/helper.js'
import usersContollers from '../controllers/users.controllers.js'
import jwt from 'jsonwebtoken'
import AuthMiddleware from '../middleware/auth.js'

const router = express.Router()

router.use(AuthMiddleware)
router.use(limiter(1, 10))

router.post('/crypto/encrypt', (req, res) => {
  const { text } = req.body

  // check user role admin
  if (!isAdmin(req, res)) return

  const key = generateKey()

  return res.status(200).json({
    status: 'success',
    data: encrypt(text, key),
    key
  })
})

router.post('/crypto/decrypt', (req, res) => {
  const { text, key } = req.body

  // check user role admin
  if (!isAdmin(req, res)) return

  if (!text) {
    return res.status(400).json({
      status: 'error',
      message: 'text is required'
    })
  }

  if (!key) {
    return res.status(400).json({
      status: 'error',
      message: 'key is required'
    })
  }

  return res.status(200).json({
    status: 'success',
    data: decrypt(text, key),
    key
  })
})

router.post('/crypto/hash', (req, res) => {
  const { text, salt } = req.body

  // check user role admin
  if (!isAdmin(req, res)) return

  if (!text) {
    return res.status(400).json({
      status: 'error',
      message: 'text is required'
    })
  }

  if (!salt) {
    return res.status(400).json({
      status: 'error',
      message: 'salt is required'
    })
  }

  return res.status(200).json({
    status: 'success',
    data: hashPassword(text, salt)
  })
})

router.post('/crypto/jwt', async (req, res) => {
  const { token } = req.body

  // check user role admin
  if (!isAdmin(req, res)) return

  if (!token) {
    return res.status(400).json({
      status: 'error',
      message: 'token is required'
    })
  }

  try {
    const decoded = jwt.verify(token, 'pxgai' as string) as { email: string, hash: string, buffer: Buffer, iat: number, exp: number }

    const decryptPassword = decrypt(decoded.hash, decoded.buffer)

    if (!decryptPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Hash or Buffer is invalid'
      })
    }

    const user = usersContollers()

    const checkUser = await user.get({
      limit: 1,
      where: {
        email: decoded.email
      },
      raw: true
    })

    if (checkUser.length === 0) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      })
    }

    const hashPasswordReq = hashPassword(decryptPassword as string, checkUser[0].salt as string)

    if (hashPasswordReq !== checkUser[0].password) {
      return res.status(400).json({
        status: 'error',
        message: 'Password is invalid'
      })
    }

    res. status(200).json({
      status: 'success',
      data: {
        ...decoded,
        raw_password: decryptPassword,
        hash_password: hashPasswordReq,
        ...checkUser[0]
      }
    })
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token invalid'
    })
  }
})

export default router