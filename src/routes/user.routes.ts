import express from 'express'
import Profile from './User/Profile.js'

const router = express.Router()

router.get('/profile', Profile)
router.get('/profile/:id', Profile)

export default router


