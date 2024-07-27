import GetImgModules from '../../modules/GetImgModules.js';
import type { Request, Response } from 'express';

export default (req: Request, res: Response) => {
  const { filter } = req.query as { filter: 'stable-diffusion' | 'stable-diffusion-xl' | null }

  if (filter) {
    if (filter !== 'stable-diffusion' && filter !== 'stable-diffusion-xl') {
      return res.status(400).json({
        status: 'error',
        message: 'filter must be stable-diffusion or stable-diffusion-xl'
      })
    }
  }

  const getimg = new GetImgModules();

  getimg.getAllModel(filter)
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