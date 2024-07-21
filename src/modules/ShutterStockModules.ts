//@ts-expect-error no types
import sstk from 'shutterstock-api'
import type { SearchQueryAttributes } from '../types/types.js'
import 'dotenv/config'

export default class ShutterStockModules {
  private apiKey: string
  private api: typeof sstk

  constructor () {
    this.apiKey = process.env.SHUTTERSTOCK_API_KEY as string

    if (!this.apiKey) {
      throw new Error('SHUTTERSTOCK_API_KEY is not defined')
    }

    this.start()
  }

  start () {
    sstk.setAccessToken(this.apiKey)
    this.api = new sstk.ImagesApi()
  }

  searchImages (query: SearchQueryAttributes) {
    if (!query.page)
      query.page = 1

    if (!query.per_page)
      query.per_page = 10

    return new Promise((resolve, reject) => {
      this.api.searchImages(query)
        .then((data: any) => {
          return resolve(data)
        })
        .catch((error: any) => {
          reject(error)
        });
    })
  }
}