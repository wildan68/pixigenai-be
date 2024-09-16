import type { Filterable, FindOptions, InferAttributes } from 'sequelize'
import models from '../models/index.js'
import type { ModelsAttributes } from '../types/types.d.js'

const { MODELS } = models

export default function modelsControllers() {
  return {
    async get(query: FindOptions & Filterable = {}) {
      return new Promise<InferAttributes<ModelsAttributes>[]>((resolve, reject) => {
        MODELS.findAll(query)
          .then((data) => {
            return resolve(data)
          })
          .catch((err) => {
            return reject(err)
          })
      })
    },
    async create(payload: InferAttributes<ModelsAttributes>) {
      return new Promise((resolve, reject) => {
        MODELS.create(payload)
          .then((data) => {
            return resolve(data)
          })
          .catch((err) => {
            return reject(err)
          })
      })
    },
    async update(payload: InferAttributes<ModelsAttributes>, query: FindOptions & Filterable) {
      return new Promise((resolve, reject) => {
        MODELS.update(payload, query as never)
          .then((resp) => {
            return resolve(resp)
          })
          .catch((err) => {
            return reject(err)
          })
      })
    },
    async delete(query: FindOptions & Filterable) {
      return new Promise((resolve, reject) => {
        MODELS.destroy(query)
          .then((resp) => {
            return resolve(resp)
          })
          .catch((err) => {
            return reject(err)
          })
      })
    }
  }
}
