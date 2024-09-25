import type { Request, Response } from 'express'
import { validation } from '../../utils/helper.js'
import RegisterStores from '../../stores/RegisterStores.js'
import MailTransporterStores from '../../stores/MailTransporterStores.js'
import usersContollers from '../../controllers/users.controllers.js'
import { randomString } from '../../utils/helper.js'
import 'dotenv/config'

export default async (req: Request, res: Response) => {
  const { email } = req.body as { email: string }
  const { store } = RegisterStores()
  const { sendEmail } = MailTransporterStores()

  if (!email) {
    return res.status(400).json({
      status: 'error',
      message: 'Email is required'
    })
  }

  if (!validation(email, 'email')) {
    return res.status(400).json({
      status: 'error',
      message: 'Email is invalid'
    })
  }

  const token = randomString(50)

  // mail options
  const mailOptions = {
    from: 'no-reply@pixigen.ai',
    to: email,
    subject: `Forgot Password Account | ${process.env.APP_NAME}`,
    html: `
      <p>Someone is trying to recover your account password. If this is true, please press Recover Password below.</p>

      <a 
        style="backgroud-color: #02E644; padding: 10px 20px; border-radius: 6px; border: none; cursor: pointer; text-decoration: none"
        href="${process.env.APP_URL}/reset-password?token=${token}"
        target="_blank"
      >
        Recover Password
      </a>
    `
  }

  // check email
  const user = usersContollers()

  const checkEmail = await user.get({
    limit: 1,
    where: {
      email
    },
    raw: true
  })

  if (checkEmail.length > 0) {
    // send mail
    // await transporter.sendMail(mailOptions, (error) => {
    //   if (error) {
    //     return res.status(500).json({
    //       status: 'error',
    //       message: error
    //     })
    //   }
    // })
    await sendEmail(mailOptions)

    const checkStore = store.get(token)

    if (checkStore) {
      store.delete(token)
    }

    // set token in store
    store.set(token, { email, token })

    // delete after 5 minutes
    setTimeout(() => {
      store.delete(token)
    }, 5 * 60 * 1000)
  }

  return res.status(200).json({
    status: 'success',
    message: 'Forgot Password Request Sent to Email'
  })
}