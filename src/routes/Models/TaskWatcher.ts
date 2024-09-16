import type { Request, Response } from 'express'
import TripoModules from '../../modules/TripoModules.js'

export default async (req: Request, res: Response) => {
  const { task_id } = req.params

  if (!task_id) {
    return res.status(400).json({
      status: 'error',
      message: 'Task ID is required'
    })
  }

  const tripoModules = new TripoModules()

  return tripoModules.taskWatcher(task_id)
    .then((data) => {
      res.status(200).json({
        status: 'success',
        data
      })
    })
    .catch((error) => {
      res.status(500).json({
        status: 'error',
        message: error
      })
    })
}