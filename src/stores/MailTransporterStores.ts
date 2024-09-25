import nodemailer, { SentMessageInfo } from 'nodemailer'
import 'dotenv/config'
import { MailOptions } from 'nodemailer/lib/json-transport'

export default function MailTransporterStores () {
  /**
   * Setup App Password for SMTP
   * https://myaccount.google.com/u/0/apppasswords
   */
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_MAIL,
      pass: process.env.SMTP_PASSWORD, 
    },
  })

  const sendEmail = async (mailData: MailOptions) => await new Promise((resolve, reject) => {
    transporter.sendMail(mailData).then((info: SentMessageInfo) => {
      if (info.response.includes('250')) {
        return resolve(true)
      }
      return reject(new Error('Email not sent'))
    })
  })

  return {
    transporter,
    sendEmail
  }
}