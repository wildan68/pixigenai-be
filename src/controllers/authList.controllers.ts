import type { Filterable, FindOptions, InferAttributes } from 'sequelize'
import models from '../models/index.js'
import type { AuthListAttributes } from '../types/types.d.js'

const { AUTH_LIST } = models

export default function authListContollers() {
  return {
    async get(query: FindOptions & Filterable = {}) {
      return new Promise<InferAttributes<AuthListAttributes>[]>((resolve, reject) => {
        AUTH_LIST.findAll(query)
          .then((data) => {
            return resolve(data)
          })
          .catch((err) => {
            return reject(err)
          })
      })
    },
    async create(payload: InferAttributes<AuthListAttributes>) {
      return new Promise((resolve, reject) => {
        AUTH_LIST.create(payload)
          .then((data) => {
            return resolve(data)
          })
          .catch((err) => {
            return reject(err)
          })
      })
    },
    async update(payload: InferAttributes<AuthListAttributes>, query: FindOptions & Filterable) {
      return new Promise((resolve, reject) => {
        AUTH_LIST.update(payload, query as never)
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
