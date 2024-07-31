import express from 'express'
import { syncDBUsers } from '../seeders/sync.db.js'
import { isAdmin } from '../utils/helper.js'

const router = express.Router();

router.get('/sync/db/users', (req, res) => {
  // check user role admin
  // if (!isAdmin(req, res)) return
  const { key } = req.query as { key: string }

  if (key !== '12356789') {
    return res.status(401).json({
      status: 'error',
      message: 'Unauthorized'
    })
  }

  syncDBUsers()
    .then(() => {
      return res.status(200).json({
        status: 'success',
        message: 'Users synced'
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