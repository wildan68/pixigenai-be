import type { Request, Response } from 'express'
import modelsControllers from '../../controllers/models.controllers.js'

export default async (req: Request, res: Response) => {
  const models = await modelsControllers().get()

  res.status(200).json({
    status: 'success',
    data: models.map(item => ({
      id: item.id,
      status: 'success',
      task_id: item.task_id,
      draft_model_id: null,
      result: {
        model: {
          id: item.glb_asset_id,
          type: 'glb',
          url: item.glb_path
        },
        thumbnail: {
          id: item.thumbnail_asset_id,
          type: 'webp',
          url: item.thumbnail_url
        }
      },
      user_id: item.user_id,
      prompt: item.prompt,
      type: item.type,
      is_private: item.is_private
    })) || []
  })
}