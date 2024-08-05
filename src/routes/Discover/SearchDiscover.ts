import type { Request, Response } from 'express'
import TripoModules from '../../modules/TripoModules.js'

export default async (req: Request, res: Response) => {
  const { text } = req.query as { text: string }

  if (!text) {
    return res.status(400).json({
      status: 'error',
      message: 'text is required'
    })
  }

  const tripo = new TripoModules()

  tripo.searchModel({ prompt: text })
    .then(data => {
      const reMapping = data.payload.map((item) => ({
        id: item.id,
        task_id: item.task_id,
        thumb_url: item.thumbnail_url,
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