import 'dotenv/config'
import type { Dialect } from 'sequelize/types'

interface Config {
  HOST: string
  USER: string
  PASSWORD: string | undefined
  DB: string
  dialect: Dialect
  pool: {
    max: number
    min: number
    acquire: number
    idle: number
  }
}

export default <Config>{
  HOST: process.env.DB_HOST,
  USER: process.env.DB_USER,
  PASSWORD: process.env.DB_PASSWORD,
  DB: process.env.DB_NAME,
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
}