import type { Request, Response } from 'express'
import RegisterStores from '../../stores/RegisterStores.js'
import MailTransporterStores from '../../stores/MailTransporterStores.js'

export default async (req: Request, res: Response) => {
  const { email } = req.body as { email: string }
  const { store, generateOTP } = RegisterStores()
  const { transporter } = MailTransporterStores()

  if (!email) {
    return res.status(400).json({
      status: 'error',
      message: 'Email are required'
    })
  }

  const getData = store.get(email)

  if (!getData) {
    return res.status(404).json({
      status: 'error',
      message: 'Not Registered Yet'
    })
  }

  // delete old otp data
  store.delete(`${email}_otp`)

  const newOtp = generateOTP()
  store.set(`${email}_otp`, newOtp)

  // const send OTP Email
  const mailOptions = {
    from: 'support@pixigen.ai',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${newOtp}`,
  }

  transporter.sendMail(mailOptions, (error) => {
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