import 'dotenv/config'
import axios, { AxiosInstance } from 'axios'

export default class AdobeStockModules {
  private apiKey: string
  private axios: AxiosInstance
  private BASE_URL = 'https://stock.adobe.io/Rest'

  constructor () {
    this.apiKey = process.env.ADOBESTOCK_API_KEY as string
    this.axios = axios

    if (!this.apiKey) {
      throw new Error('ADOBESTOCK_API_KEY is not defined')
    }

    this.setupAxios()
  }

  private setupAxios () {
    this.axios = axios.create({
      baseURL: this.BASE_URL,
      headers: {
        'x-Product': 'PixigenAI',
        'x-api-key': this.apiKey
      }
    })
  }

  private buildQuery (query: any) {
    return Object.keys(query).map(key => `${key}=${query[key]}`).join('&')
  }

  async searchImages (query: any) {
    return new Promise((resolve, reject) => {
      const calculatePageToOffset = () => {
        return (parseInt(query.page || 1) - 1) * parseInt(query.per_page || 10) + 1
      }

      const payload = {
        'search_parameters[words]': query.query,
        'search_parameters[order]': 'featured',
        'search_parameters[limit]': query.per_page || 10,
        'search_parameters[offset]': calculatePageToOffset()
      }

      this.axios.get(`/Media/1/Search/Files?${this.buildQuery(payload)}`)
        .then(({ data }) => {
          return resolve({
            ...data,
            page: query.page || 1,
            per_page: query.per_page || 10
          })
        })
        .catch((error: any) => {
          return reject(error)
        })
    })
  }
}