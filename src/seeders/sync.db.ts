import models from '../models/index.js'

const { USERS } = models

export function syncDBUsers() {
  return new Promise((resolve, reject) => {
    USERS.sync({ alter: true })
      .then((data) => {
        console.log('[DB] Users Synced')
        return resolve(data)
      })
      .catch((err) => {
        console.log(`[DB] Users Error : ${err}`)
        return reject(err)
      })
  })
}