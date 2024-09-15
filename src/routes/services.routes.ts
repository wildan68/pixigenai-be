import express from 'express'
import CreateImageFromURL from '../services/CreateImageFromURL.js'

const router = express.Router()

router.get('/assets/webp', CreateImageFromURL)

export default router