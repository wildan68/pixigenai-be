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
    const decoded = jwt.verify(token, 'tukangpacul' as string) as UsersAttributes

    const user = await users.get({
      limit: 1,
      where: {
        id: decoded.id,
        telegram_id: decoded.telegram_id,
        username: decoded.username
      },
      raw: true
    })

    if (user.length === 0) {
      return res.status(401).json({
        status: 'error',
        message: 'Unauthorized'
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