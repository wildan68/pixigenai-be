import type { Request, Response } from 'express'
import { validation } from '../../utils/helper.js'
import usersContollers from '../../controllers/users.controllers.js'
import RegisterStores from '../../stores/RegisterStores.js'

export default async (req: Request, res: Response) => {
  const { email, fullname, username } = req.body as { email: string, fullname: string, username: string }
  const { store } = RegisterStores()

  if (!email) {
    return res.status(400).json({
      status: 'error',
      message: 'Email are required'
    })
  }

  if (!validation(email, 'email')) {
    return res.status(400).json({
      status: 'error',
      message: 'Email is invalid'
    })
  }
  
  if (!fullname) {
    return res.status(400).json({
      status: 'error',
      message: 'Fullname are required'
    })
  }

  if (!validation(fullname, 'min', 1)) {
    return res.status(400).json({
      status: 'error',
      message: 'Fullname must be at least 1 characters'
    })
  }

  if (!validation(fullname, 'max', 30)) {
    return res.status(400).json({
      status: 'error',
      message: 'Fullname must be at most 30 characters'
    })
  }

  if (!username) {
    return res.status(400).json({
      status: 'error',
      message: 'Username are required'
    })
  }

  if (!validation(username, 'min', 6)) {
    return res.status(400).json({
      status: 'error',
      message: 'Username must be at least 6 characters'
    })
  }

  if (!validation(username, 'max', 20)) {
    return res.status(400).json({
      status: 'error',
      message: 'Username must be at most 20 characters'
    })
  }

  const user = usersContollers()

  // check username exist
  const checkUsername = await user.get({
    where: {
      username
    },
    raw: true
  })

  if (checkUsername.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Username already exist'
    })
  }

  // get temporary register data
  const getRegisterData = store.get(email)

  if (!getRegisterData) {
    return res.status(404).json({
      status: 'error',
      message: 'Register data not found'
    })
  }

  // get verified otp
  const verifiedOtp = store.get(`${email}_verified`)

  if (!verifiedOtp) {
    return res.status(400).json({
      status: 'error',
      message: 'OTP not verified'
    })
  }

  // delete temporary verified otp
  store.delete(`${email}_verified`)

  user.create({ 
    ...getRegisterData,
    username, 
    fullname, 
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
    .finally(() => store.delete(email))
}