import type { Request, Response } from 'express'
import modelsControllers from '../../controllers/models.controllers.js'

export default async (req: Request, res: Response) => {
  const models = await modelsControllers().get()

  res.status(200).json({
    status: 'success',
    data: models || []
  })
}