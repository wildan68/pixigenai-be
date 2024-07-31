import type { Request, Response } from 'express'
import usersContollers from '../../controllers/users.controllers.js'

export default async (req: Request, res: Response) => {
  const { id } = req.params as { id: string }
  const user = req.user
  const users = usersContollers()

  // For My Profile
  if (!id) {
    return res.status(200).json({
      status: 'success',
      data: {
        ...user
      }
    })
  }

  // for other profile
  const getUser = await users.get({
    limit: 1,
    where: {
      id
    },
    raw: true
  })

  if (getUser.length === 0) {
    return res.status(404).json({
      status: 'error',
      message: 'User not found'
    })
  }

  delete getUser[0].password
  delete getUser[0].salt
  delete getUser[0].role

  return res.status(200).json({
    status: 'success',
    data: {
      ...getUser[0]
    }
  })
}