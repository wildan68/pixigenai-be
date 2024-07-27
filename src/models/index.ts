import { Sequelize } from 'sequelize'
import mysql2 from 'mysql2'
import dbConfig from '../config/db.config.js'
import usersModels from './users.models.js'

const sequelize = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    dialectModule: mysql2,
    // operatorAlias: false,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
    logging: false,
  },
)

const models = {
  USERS: usersModels(sequelize),
}

export default models
