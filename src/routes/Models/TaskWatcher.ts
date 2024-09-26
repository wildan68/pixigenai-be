import type { Request, Response } from 'express'
import TripoModules from '../../modules/TripoModules.js'
import modelsControllers from '../../controllers/models.controllers.js'
import CloudinaryModules from '../../modules/CloudinaryModules.js'

export default async (req: Request<{ task_id: string,}, never, never, { is_private: boolean, type: 'ws' | 'polling' }>, res: Response) => {
  const { task_id } = req.params
  const { is_private, type } = req.query
  const models = modelsControllers()
  const Cloudinary = new CloudinaryModules()

  if (!task_id) {
    return res.status(400).json({
      status: 'error',
      message: 'Task ID is required'
    })
  }

  const tripoModules = new TripoModules()

  return tripoModules.taskWatcher(task_id, type)
    .then(async (data) => {
      // check if task_id exist
      const modelData = await models.get({
        raw: true,
        where: {
          task_id: data.task_id
        },
        limit: 1
      })

      if (modelData.length === 0) {
        await Cloudinary.uploadImage({
          filePath: data.result.model.url,
          folder: '/temp/glb/'
        })
          .then(async (glb) => {
            if (!glb) return res.status(500).json({
              status: 'error',
              message: 'Failed process GLB'
            })

            await Cloudinary.uploadImage({
              filePath: data.result.rendered_image.url,
              folder: '/temp/thumbnail/'
            })
              .then(async (thumbnail) => {
                if (!thumbnail) return res.status(500).json({
                  status: 'error',
                  message: 'Failed process Thumbnail'
                })
                // create data model
                await models.create({
                  user_id: req.user.id,
                  draft_model_id: null,
                  glb_asset_id: glb.asset_id,
                  glb_path: glb.url,
                  prompt: data.prompt,
                  task_id: data.task_id,
                  thumbnail_asset_id: thumbnail.asset_id,
                  thumbnail_url: thumbnail.url,
                  type: data.type,
                  is_private
                })
              })
          })
          .catch((error) => {
            return res.status(500).json({
              status: 'error',
              message: error
            })
          })
      }

      const reGetData = await models.get({
        raw: true,
        where: {
          task_id: data.task_id
        },
        limit: 1
      })

      return res.status(200).json({
        status: 'success',
        data: {
          id: reGetData[0].id,
          status: 'success',
          task_id: reGetData[0].task_id,
          draft_model_id: null,
          result: {
            model: {
              id: reGetData[0].glb_asset_id,
              type: 'glb',
              url: reGetData[0].glb_path
            },
            thumbnail: {
              id: reGetData[0].thumbnail_asset_id,
              type: 'webp',
              url: reGetData[0].thumbnail_url
            }
          },
          user_id: reGetData[0].user_id,
          prompt: reGetData[0].prompt,
          type: reGetData[0].type,
          is_private: reGetData[0].is_private
        }
      })
    })
    .catch((error) => {
      res.status(500).json({
        status: 'error',
        message: error
      })
    })
}