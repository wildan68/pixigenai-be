import type { Request, Response } from 'express'
import ShutterStockModules from '../../modules/ShutterStockModules.js'

export default async (req: Request, res: Response) => {
  const query = req.query.query as string
  const page = req.query.page as string
  const per_page = req.query.per_page as string
  
  const sstk = new ShutterStockModules()
  
  // if (!query) {
  //   return res.status(400).json({
  //     status: 'error',
  //     message: 'Query is required'
  //   })
  // }

  return sstk.searchImages({
    query,
    sort: 'random',
    page: page || 1,
    per_page: per_page || 10,
    image_type: 'photo',
  })
    .then(data => {
      return res.status(200).json({
        status: 'success',
        data
      })
    })
    .catch(err => {
      return res.status(500).json({
        status: 'error',
        message: err
      })
    })
}