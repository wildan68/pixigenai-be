import GetImgModules from '../../modules/GetImgModules.js'
import type { Request, Response } from 'express'
import type { DiffusionXLAttributes } from '../../types/types.js'

export default (req: Request, res: Response) => {
  const { prompt } = req.body as DiffusionXLAttributes

  if (!prompt) {
    return res.status(400).json({
      status: 'error',
      message: 'prompt is required'
    })
  }

  const getimg = new GetImgModules();

  getimg.textToImageDiffusionXL(req.body)
    .then(data => {
      return res.status(200).json({
        status: 'success',
        data
      })
    })
    .catch((error) => {
      return res.status(500).json({
        status: 'error',
        message: error
      })
    })
}