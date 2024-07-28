import nodemailer from 'nodemailer'
import 'dotenv/config'

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

  return {
    transporter
  }
}