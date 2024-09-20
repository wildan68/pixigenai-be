import type { Filterable, FindOptions, InferAttributes } from 'sequelize'
import models from '../models/index.js'
import type { TasksAttributes } from '../types/types.d.js'

const { TASKS } = models

export default function tasksControllers() {
  return {
    async get(query: FindOptions & Filterable = {}) {
      return new Promise<InferAttributes<TasksAttributes>[]>((resolve, reject) => {
        TASKS.findAll(query)
          .then((data) => {
            return resolve(data)
          })
          .catch((err) => {
            return reject(err)
          })
      })
    },
    async create(payload: InferAttributes<TasksAttributes>) {
      return new Promise((resolve, reject) => {
        TASKS.create(payload)
          .then((data) => {
            return resolve(data)
          })
          .catch((err) => {
            return reject(err)
          })
      })
    },
    async update(payload: InferAttributes<TasksAttributes>, query: FindOptions & Filterable) {
      return new Promise((resolve, reject) => {
        TASKS.update(payload, query as never)
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
        TASKS.destroy(query)
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
