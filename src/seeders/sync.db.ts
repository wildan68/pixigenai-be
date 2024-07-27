import models from '../models/index.js'

const { USERS } = models

export default async function syncDB() {
  await USERS.sync({ alter: true })
    .then(() => console.log('[DB] Users Synced'))
    .catch((err) => console.log(`[DB] Users Error : ${err}`))
}