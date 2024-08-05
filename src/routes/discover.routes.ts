import express from 'express'
import MainDiscover from './Discover/MainDiscover.js'
import SearchDiscover from './Discover/SearchDiscover.js'

const router = express.Router()

router.get('/', MainDiscover)
router.get('/search', SearchDiscover)

export default router