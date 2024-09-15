import 'dotenv/config'
import UtilitiesModules from './UtilitiesModules.js'
import axios, { AxiosInstance } from 'axios'
import { TripoHaystackResponse } from '../types/types.js'

export default class TripoModules extends UtilitiesModules {
  private apiKey: string
  private jwtKey: string 
  private axios: AxiosInstance

  constructor() {
    super()

    this.apiKey = process.env.TRIPO_API_KEY as string
    this.jwtKey = process.env.TRIPO_JWT_KEY as string
    this.axios = axios

    if (!this.apiKey) {
      throw new Error('TRIPO_API_KEY is not defined')
    }
    if (!this.jwtKey) {
      throw new Error('TRIPO_JWT_KEY is not defined')
    }

    this.setupAxios()
  }

  setupAxios () {
    this.axios = axios.create({
      baseURL: 'https://api.tripo3d.ai/v2/openapi',
      headers: {
        Authorization: `Bearer ${this.apiKey}`
      }
    })
  }
  
  getRecommendModel (): Promise<TripoHaystackResponse> {
    return new Promise((resolve, reject) => {
      this.axios.get('https://api.tripo3d.ai/v2/haystack/recommend', {
        headers: {
          Authorization: `Bearer ${this.jwtKey}`
        }
      })
        .then(({ data }) => resolve(data))
        .catch((error) => reject(error))
    })
  }

  searchModel ({ prompt, type, limit }: { prompt: string, type?: string, limit?: number }): Promise<TripoHaystackResponse> {
    const query = {
      prompt: prompt,
      type: type || 'text_to_model',
      limit: limit || 24
    }

    return new Promise((resolve, reject) => {
      this.axios.get(`https://api.tripo3d.ai/v2/haystack/search`, {
        params: query,
        headers: {
          Authorization: `Bearer ${this.jwtKey}`
        }
      })
        .then(({ data }) => resolve(data))
        .catch((error) => reject(error))
    })
  }

  getThumbnailId (url: string) {
    const getUrl = url.split('/')
    
    return getUrl.slice(3).join('/')
  }
}