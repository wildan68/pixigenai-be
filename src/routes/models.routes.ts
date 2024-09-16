import express from 'express'
import GetAllModels from './Models/GetAllModels.js'
import GenerateModels from './Models/GenerateModels.js'
import TaskWatcher from './Models/TaskWatcher.js'

const router = express.Router()

router.get('/', GetAllModels)
router.post('/', GenerateModels)
router.get('/task/:task_id', TaskWatcher)

export default router