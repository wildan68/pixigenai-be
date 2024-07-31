import usersContollers from '../controllers/users.controllers.js'
import jwt from 'jsonwebtoken'
import type { Request, Response, NextFunction } from 'express'
import { UsersAttributes } from '../types/types.d.js'

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
    const decoded = jwt.verify(token, 'pxgai' as string) as { id: string, email: string, iat: number, exp: number }

    // check jwt expired
    if (decoded.exp < Date.now() / 1000) {
      return res.status(451).json({
        status: 'error',
        message: 'Token expired'
      })
    }

    const user = await users.get({
      limit: 1,
      where: {
        email: decoded.email,
        id: decoded.id
      },
      raw: true
    })

    if (user.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
      })
    }

    delete user[0].password
    delete user[0].salt
    delete user[0].role

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