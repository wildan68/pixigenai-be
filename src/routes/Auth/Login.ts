import type { Request, Response } from 'express'
import usersContollers from '../../controllers/users.controllers.js'
import { hashPassword } from '../../utils/helper.js'
import jwt from 'jsonwebtoken'

export default async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string, password: string }

  if (!email) {
    return res.status(400).json({
      status: 'error',
      message: 'Email is required'
    })
  }

  if (!password) {
    return res.status(400).json({
      status: 'error',
      message: 'Password is required'
    })
  }

  const user = usersContollers()

  
  const getUser = await user.get({
    where: {
      email,
    },
    raw: true
  })

  if (getUser.length === 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Email or Password is incorrect'
    })
  }

  const hashPasswordReq = hashPassword(password, getUser[0].salt as string)

  if (hashPasswordReq !== getUser[0].password) {
    return res.status(400).json({
      status: 'error',
      message: 'Email or Password is incorrect'
    })
  }

  const ip = req.clientIp

  // update last login ip
  await user.update({
    last_login_ip: ip
  }, {
    where: {
      id: getUser[0].id
    }
  })

  delete getUser[0].password
  delete getUser[0].salt
  delete getUser[0].role

  const tokenPayload = {
    id: getUser[0].id,
    email: getUser[0].email,
  }

  const token = jwt.sign(tokenPayload, 'pxgai' as string, { expiresIn: '7d' })

  return res.status(200).json({
    status: 'success',
    data: {
      token,
      ...getUser[0]
    }
  })
}