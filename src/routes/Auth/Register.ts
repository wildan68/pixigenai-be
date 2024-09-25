import type { Request, Response } from 'express'
import usersContollers from '../../controllers/users.controllers.js'
import { validation, hashPassword, generateSalt } from '../../utils/helper.js'
import RegisterStores from '../../stores/RegisterStores.js'
import MailTransporterStores from '../../stores/MailTransporterStores.js'

export default async (req: Request, res: Response) => {
  const { email, password } = req.body as { email: string, password: string }
  const { store, generateOTP } = RegisterStores()
  const { transporter } = MailTransporterStores()

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

  if (!validation(email, 'max', 30)) {
    return res.status(400).json({
      status: 'error',
      message: 'Email must be at most 30 characters'
    })
  }

  if (!validation(password, 'min', 6)) {
    return res.status(400).json({
      status: 'error',
      message: 'Password must be at least 6 characters'
    })
  }

  if (!validation(password, 'max', 50)) {
    return res.status(400).json({
      status: 'error',
      message: 'Password must be at most 50 characters'
    })
  }

  const userIp = req.clientIp

  const user = usersContollers()

  // check email exist
  const checkEmail = await user.get({
    limit: 1,
    where: {
      email
    },
    raw: true
  })

  if (checkEmail.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: 'Email already exist'
    })
  }

  // encrypt password
  const salt = generateSalt()
  const encryptedPassword = hashPassword(password, salt)

  const userData = {
    email,
    password: encryptedPassword,
    last_login_ip: userIp,
    register_ip: userIp,
    salt: salt,
  }

  const otp = generateOTP()

  const checkStoreData = store.get(email)

  // reset temporary data if exist
  if (checkStoreData) {
    store.delete(email)
    store.delete(`${email}_otp`)
  }

  // Saved Temporary Data in Store
  store.set(email, userData)
  store.set(`${email}_otp`, otp)

  // delete store after 5 minutes
  setTimeout(() => {
    store.delete(email)
  }, 5 * 60 * 1000)

  // delete otp after 2 minutes
  setTimeout(() => {
    store.delete(`${email}_otp`)
  }, 2 * 60 * 1000)

  // mail options
  const mailOptions = {
    from: 'no-reply@pixigen.ai',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  }
  
  await transporter.sendMail(mailOptions, (error) => {
    if (error) {
      return res.status(500).json({
        status: 'error',
        message: error
      })
    }
  })

  return res.status(200).json({
    status: 'success',
    message: 'OTP sent successfully'
  })
}