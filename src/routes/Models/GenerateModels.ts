import type { Request, Response } from 'express'
import type { GenerateModelPayload } from '../../types/types.js'
import TripoModules from '../../modules/TripoModules.js'

export default async (req: Request<never, never, GenerateModelPayload>, res: Response) => {
  const { type } = req.body
  const tripoModules = new TripoModules()

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
  case 'multiview_to_model': {
    const { files } = req.body

    return tripoModules.generateModels({
      type,
      files,
      mode: 'LEFT'
    })
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
  default: {
    res.status(400).json({
      status: 'error',
      message: 'Invalid type'
    })
  }
  }
}