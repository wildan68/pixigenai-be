import type { Request, Response } from 'express'
import axios from 'axios'

export default async (req: Request, res: Response) => {
  const { id } = req.query as { id: string }

  if (!id) {
    return res.status(404).json({
      status: 'error',
      message: 'Asset Not Found'
    })
  }

  return axios
    .get(`https://tripo-data.cdn.bcebos.com/${id}`, {
      responseType: 'arraybuffer'
    })
    .then((resp) => {
      res.set('Content-Type', resp.headers['content-type'])
      return res.status(200).send(resp.data)
    })
    .catch((error) => {
      return res.status(500).json({
        status: 'error',
        message: error
      })
    })
}
