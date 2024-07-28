import type { Request, Response } from 'express'
import { validation } from '../../utils/helper.js'
import RegisterStores from '../../stores/RegisterStores.js'

export default async (req: Request, res: Response) => {
  const { otp, email } = req.body as { otp: string, email: string }
  const { store } = RegisterStores()

  if (!otp) {
    return res.status(400).json({
      status: 'error',
      message: 'OTP are required'
    })
  }

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

  const getOtp = store.get(`${email}_otp`)

  if (!getOtp || getOtp !== otp) {
    return res.status(400).json({
      status: 'error',
      message: 'OTP is invalid'
    })
  }

  // delete otp
  store.delete(`${email}_otp`)

  // set verified otp
  store.set(`${email}_verified`, true)

  return res.status(200).json({
    status: 'success',
    message: 'OTP verified successfully'
  })
}