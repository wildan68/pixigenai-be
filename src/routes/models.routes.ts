import express from 'express'
import GetAllModels from './Models/GetAllModels.js'

const router = express.Router()

router.get('/', GetAllModels)

export default router