import type { Request, Response } from 'express'
import usersContollers from '../../controllers/users.controllers.js'
import { generateSalt, hashPassword, randomString } from '../../utils/helper.js'
import RegisterStores from '../../stores/RegisterStores.js'
import axios from 'axios'

export default async (req: Request, res: Response) => {
  const { access_token } = req.body as { access_token: string }
  const { store } = RegisterStores()

  if (!access_token) {
    return res.status(400).json({
      status: 'error',
      message: 'Access token is required'
    })
  }

  // getting google info account
  const { data } = await axios.get(
    'https://www.googleapis.com/oauth2/v3/userinfo',
    { headers: { Authorization: `Bearer ${access_token}` } },
  )

  // check email
  const user = usersContollers()
  const email = data.email

  const getUser = await user.get({
    limit: 1,
    where: {
      email
    },
    raw: true
  })


  // if user not found, create new user
  if (getUser.length === 0) {
    const userIp = req.clientIp

    // encrypt password
    const createRandomPassword = randomString(10, 20)

    const salt = generateSalt()
    const encryptedPassword = hashPassword(createRandomPassword, salt)

    const userData = {
      email,
      password: encryptedPassword,
      last_login_ip: userIp,
      register_ip: userIp,
      salt: salt,
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


    // redirect to setup profile
    return res.status(200).json({
      status: 'success',
      message: 'Please setup your profile',
      data: {
        registered: false,
        email,
        fullname: data.name
      }
    })
  }
}