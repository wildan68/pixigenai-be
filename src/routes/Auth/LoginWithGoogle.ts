import type { Request, Response } from 'express'
import usersContollers from '../../controllers/users.controllers.js'
import { generateSalt, hashPassword, randomString } from '../../utils/helper.js'
import RegisterStores from '../../stores/RegisterStores.js'
import axios from 'axios'
import jwt from 'jsonwebtoken'

export default async (req: Request, res: Response) => {
  const { access_token } = req.body as { access_token: string }
  const { store } = RegisterStores()

  if (!access_token) {
    return res.status(400).json({
      status: 'error',
      message: 'Access Token is required'
    })
  }

  // getting google info account
  return axios.get(
    'https://www.googleapis.com/oauth2/v3/userinfo',
    { headers: { Authorization: `Bearer ${access_token}` } },
  )
    .then(async ({ data }) => {

      // check email
      const user = usersContollers()
      const email = data.email

      const getUser = await user.get({
        limit: 1,
        where: {
          email,
          oauth_id: 'google'
        },
        raw: true
      })

      const userIp = req.clientIp

      // if user not found, create new user
      if (getUser.length === 0) {

        // encrypt password
        const createRandomPassword = randomString(20)

        const salt = generateSalt()
        const encryptedPassword = hashPassword(createRandomPassword, salt)

        const userData = {
          email,
          password: encryptedPassword,
          last_login_ip: userIp,
          register_ip: userIp,
          salt: salt,
          oauth_id: 'google'
        }

        const checkStoreData = store.get(email)

        // reset temporary data if exist
        if (checkStoreData) {
          store.delete(email)
        }

        // Saved Temporary Data in Store
        store.set(email, userData)

        // delete store after 5 minutes
        setTimeout(() => {
          store.delete(email)
        }, 5 * 60 * 1000)

        return res.status(200).json({
          status: 'success',
          message: 'Please setup your profile',
          data: {
            registered: false,
            email,
            fullname: data.name,
          }
        })
      }

      // update last login ip
      await user.update({
        last_login_ip: userIp
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
          registered: true,
          ...getUser[0]
        }
      })
    })
    .catch(err => {
      return res.status(400).json({
        status: 'error',
        message: err.response.data.error_description
      })
    })
}