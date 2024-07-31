import type { Request, Response } from 'express'
import RegisterStores from '../../stores/RegisterStores.js'

export default async (req: Request, res: Response) => {
  const { token } = req.body as { token: string }
  const { store } = RegisterStores()

  if (!token) {
    return res.status(400).json({
      status: 'error',
      message: 'Token is required'
    })
  }

  const getTokenData = store.get(token)

  if (!getTokenData) {
    return res.status(404).json({
      status: 'error',
      message: 'Token is invalid'
    })
  }

  return res.status(200).json({
    status: 'success',
    message: 'Token is valid'
  })
} 