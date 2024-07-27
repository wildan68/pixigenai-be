import GetImgModules from '../../modules/GetImgModules.js';
import type { Request, Response } from 'express';

export default (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      status: 'error',
      message: 'id is required'
    })
  }

  const getimg = new GetImgModules();

  getimg.modelDetail(id)
    .then(data => {
      if (!data) return res.status(404).json({
        status: 'error',
        message: 'model not found'
      })

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