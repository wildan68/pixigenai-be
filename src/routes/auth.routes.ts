import express from 'express'
import Register from './Auth/Register.js'

const router = express.Router()

router.post('/auth/register', Register)

export default router