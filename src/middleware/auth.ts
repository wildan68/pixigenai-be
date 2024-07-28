import usersContollers from '../controllers/users.controllers.js'
import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'
import { UsersAttributes } from '../types/types.d.js'
import { hashPassword, decrypt } from '../utils/helper.js'

const users = usersContollers()

export default async function AuthMiddleware(req: Request, res: Response, next: NextFunction) {
  if (!req.header('Authorization')) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized'
    })
  }

  const token = req.header('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized'
    })
  }

  try {
    const decoded = jwt.verify(token, 'pxgai' as string) as { email: string, hash: string, buffer: Buffer, iat: number, exp: number }

    const decryptPassword = decrypt(decoded.hash, decoded.buffer)

    // check Decrypt Password
    if (!decryptPassword) {
      return res.status(400).json({
        status: 'error',
        message: 'Hash or Buffer is invalid'
      })
    }

    // check jwt expired
    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({
        status: 'error',
        message: 'Token expired'
      })
    }

    const user = await users.get({
      limit: 1,
      where: {
        email: decoded.email
      },
      raw: true
    })

    if (user.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      })
    }

    // create Hash Password
    const hashPasswordReq = hashPassword(decryptPassword as string, user[0].salt as string)

    if (hashPasswordReq !== user[0].password) {
      return res.status(400).json({
        status: 'error',
        message: '[1] Unauthorized'
      })
    }

    // add req.user
    req.user = user[0] as UsersAttributes
    next()
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token invalid'
    })
  }
}