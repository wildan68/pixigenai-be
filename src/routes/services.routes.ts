import express from 'express'
import ShutterStockModules from '../modules/ShutterStockModules.js'
import AdobeStockModules from '../modules/AdobeStockModules.js'
import GetModels from './GetImg/GetModels.js'
import ModelDetail from './GetImg/ModelDetail.js'
import TextToImageDiffusionXL from './GetImg/TextToImageDiffusionXL.js'

const router = express.Router()
const sstk = new ShutterStockModules()
const astk = new AdobeStockModules()

router.post('/sstk/popular', (req, res) => {
  const { query, page, per_page } = req.body

  if (!query) {
    return res.status(400).json({
      status: 'error',
      message: 'query is required'
    })
  }

  return sstk.searchImages({
    query,
    sort: 'popular',
    page: page || 1,
    per_page: per_page || 10,
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
})

router.post('/astk/popular', (req, res) => {
  const { query, page, per_page } = req.body

  if (!query) {
    return res.status(400).json({
      status: 'error',
      message: 'query is required'
    })
  }

  return astk.searchImages({
    query,
    page,
    per_page
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
})

router.get('/models', GetModels)
router.get('/models/:id', ModelDetail)
router.post('/create/text-to-images/difussionxl', TextToImageDiffusionXL)


export default router