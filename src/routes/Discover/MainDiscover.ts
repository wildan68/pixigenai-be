import type { Request, Response } from 'express'
import TripoModules from '../../modules/TripoModules.js'

export default async (req: Request, res: Response) => {
  const tripo = new TripoModules()

  tripo.getRecommendModel()
    .then(data => {
      const reMapping = data.payload.map((item) => ({
        id: item.id,
        task_id: item.task_id,
        thumb_url: tripo.getThumbnailId(item.thumbnail_url),
        description: item.prompt,
        type: item.type
      }))

      return res.status(200).json({
        status: 'success',
        data: reMapping
      })
    })
    .catch((error) => {
      return res.status(500).json({
        status: 'error',
        message: error
      })
    })
}