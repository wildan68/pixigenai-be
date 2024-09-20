import type { Request, Response } from 'express'
import type { GenerateModelPayload } from '../../types/types.js'
import TripoModules from '../../modules/TripoModules.js'
import tasksControllers from '../../controllers/tasks.controllers.js'

export default async (req: Request<never, never, GenerateModelPayload>, res: Response) => {
  const { type } = req.body
  const tripoModules = new TripoModules()
  const tasks = tasksControllers()

  const saveTask = async ({ id }: { id: string}) => {
    return await tasks.create({
      task_id: id,
      status: 'success',
      user_id: req.user?.id
    })
  }

  if (!type) {
    return res.status(400).json({
      status: 'error',
      message: 'Type is required'
    })
  }

  switch (type) {
  case 'text_to_model': {
    const { prompt } = req.body

    if (!prompt) {
      return res.status(400).json({
        status: 'error',
        message: 'Prompt is required'
      })
    }

    return tripoModules.generateModels({
      type,
      prompt
    })
      .then(async (data) => {
        await saveTask({ id: data.task_id })

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
  case 'image_to_model': {
    const { file } = req.body

    if (!file) {
      return res.status(400).json({
        status: 'error',
        message: 'File is required'
      })
    }

    return tripoModules.generateModels({
      type,
      file
    })
      .then(async (data) => {
        await saveTask({ id: data.task_id })

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
  case 'multiview_to_model': {
    const { files } = req.body

    return tripoModules.generateModels({
      type,
      files,
      mode: 'LEFT'
    })
      .then(async (data) => {
        await saveTask({ id: data.task_id })

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
  default: {
    res.status(400).json({
      status: 'error',
      message: 'Invalid type'
    })
  }
  }
}