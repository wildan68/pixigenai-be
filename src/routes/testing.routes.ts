import express from 'express'
import HFModules from '../modules/HFModules.js'

const router = express.Router()


router.post('/text-to-image', (req, res) => {
  const { prompt, models } = req.body as { prompt: string, models: string }

  if (!prompt) {
    return res.status(400).json({
      status: 'error',
      message: 'prompt is required'
    })
  }
  
  const hf = new HFModules();

  return hf.textToImage(prompt, models)
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
})

export default router