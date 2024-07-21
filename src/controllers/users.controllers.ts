import type { Filterable, FindOptions, InferAttributes } from 'sequelize'
import models from '../models/index.js'
import type { UsersAttributes } from '../types/types.d.js'

const { USERS } = models

export default function usersContollers() {
  return {
    async get(query: FindOptions & Filterable = {}) {
      return new Promise<InferAttributes<UsersAttributes>[]>((resolve, reject) => {
        USERS.findAll(query)
          .then((data) => {
            return resolve(data)
          })
          .catch((err) => {
            return reject(err)
          })
      })
    },
    async create(payload: InferAttributes<UsersAttributes>) {
      return new Promise((resolve, reject) => {
        USERS.create(payload)
          .then((data) => {
            return resolve(data)
          })
          .catch((err) => {
            return reject(err)
          })
      })
    },
    async update(payload: InferAttributes<UsersAttributes>, query: FindOptions & Filterable) {
      return new Promise((resolve, reject) => {
        USERS.update(payload, query as never)
          .then((resp) => {
            return resolve(resp)
          })
          .catch((err) => {
            return reject(err)
          })
      })
    },
  }
}
