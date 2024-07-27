import type { Request, Response } from 'express'
import usersContollers from '../../controllers/users.controllers.js'
import { validation, randomString } from '../../utils/helper.js'

export default async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string, password: string }

  if (!email || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Email and Password are required'
    })
  }

  if (!validation(email, 'email')) {
    return res.status(400).json({
      status: 'error',
      message: 'Email is invalid'
    })
  }

  if (!validation(password, 'min', 6)) {
    return res.status(400).json({
      status: 'error',
      message: 'Password must be at least 6 characters'
    })
  }

  const userIp = req.clientIp

  const user = usersContollers()

  // check email exist
  const checkEmail = await user.get({
    where: {
      email
    }
  })

  if (checkEmail.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Email already exist'
    })
  }

  user.create({ 
    email, 
    password, 
    username: randomString(10), 
    fullname: '', 
    last_login_ip: userIp, 
    register_ip: userIp 
  })
    .then(() => {
      return res.status(200).json({
        status: 'success',
        message: 'User created successfully',
      })
    })
    .catch((error) => {
      return res.status(500).json({
        status: 'error',
        message: error
      })
    })
}