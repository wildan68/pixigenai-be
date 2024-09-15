import models from '../models/index.js'

const { USERS, MODELS } = models

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

export function syncDBModels() {
  return new Promise((resolve, reject) => {
    MODELS.sync({ alter: true })
      .then((data) => {
        console.log('[DB] Models Synced')
        return resolve(data)
      })
      .catch((err) => {
        console.log(`[DB] Models Error : ${err}`)
        return reject(err)
      })
  })
}