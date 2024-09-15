import express from 'express'
import { syncDBUsers, syncDBModels } from '../seeders/sync.db.js'
import { isAdmin } from '../utils/helper.js'

const router = express.Router();

router.use((req, res, next) => {
  const { key } = req.query as { key: string }

  if (key !== '12356789') {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized'
    })
  }

  next()
})

router.get('/sync/db', async (req, res) => {
  // check user role admin
  // if (!isAdmin(req, res)) return

  await syncDBUsers()
  await syncDBModels()

  return res.status(200).json({
    status: 'success',
    message: 'DB Synced'
  })
})

export default router