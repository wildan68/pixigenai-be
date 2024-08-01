import express from 'express'
import MainDiscover from './Discover/MainDiscover.js'

const router = express.Router()

router.get('/', MainDiscover)

export default router