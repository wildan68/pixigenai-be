import type { Request, Response } from 'express'
import RegisterStores from '../../stores/RegisterStores.js'
import { validation, generateSalt, hashPassword } from '../../utils/helper.js'
import usersContollers from '../../controllers/users.controllers.js'

export default async (req: Request, res: Response) => {
  const { password, token } = req.body as { password: string, token: string }
  const { store } = RegisterStores()

  if (!password) {
    return res.status(400).json({
      status: 'error',
      message: 'Password is required'
    })
  }

  if (!token) {
    return res.status(400).json({
      status: 'error',
      message: 'Token is required'
    })
  }

  if (!validation(password, 'min', 6)) {
    return res.status(400).json({
      status: 'error',
      message: 'Password must be at least 6 characters'
    })
  }

  const getDataToken = store.get(token)

  if (!getDataToken) {
    return res.status(404).json({
      status: 'error',
      message: 'Token is invalid'
    })
  }

  const user = usersContollers()
  
  const getUser = await user.get({
    limit: 1,
    where: {
      email: getDataToken.email
    },
    raw: true
  })

  if (getUser.length === 0) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    })
  }

  const salt = generateSalt()
  const hash = hashPassword(password, salt)

  // update password, salt and updated_at
  const updateUser = await user.update({
    password: hash,
    salt,
    updated_at: new Date()
  }, {
    where: {
      email: getDataToken.email
    }
  })

  if (!updateUser) {
    return res.status(500).json({
      status: 'error',
      message: 'Something went wrong'
    })
  }

  // delete store
  store.delete(token)

  return res.status(200).json({
    status: 'success',
    message: 'Password reset successfully'
  })

}