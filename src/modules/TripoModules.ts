import 'dotenv/config'
import UtilitiesModules from './UtilitiesModules.js'
import axios, { AxiosInstance } from 'axios'
import { TripoHaystackResponse, GenerateModelPayload } from '../types/types.js'
import WebSocket from 'ws'
import modelsControllers from '../controllers/models.controllers.js'
import CloudinaryModules from './CloudinaryModules.js'

export default class TripoModules extends UtilitiesModules {
  private apiKey: string
  private jwtKey: string 
  private axios: AxiosInstance
  private BASE_URL: string
  private MODELS_CONTROLLERS = modelsControllers()
  private Cloudinary = new CloudinaryModules()

  constructor() {
    super()

    this.apiKey = process.env.TRIPO_API_KEY as string
    this.jwtKey = process.env.TRIPO_JWT_KEY as string
    this.axios = axios
    this.BASE_URL = 'https://api.tripo3d.ai/v2/openapi'

    if (!this.apiKey) {
      throw new Error('TRIPO_API_KEY is not defined')
    }

    this.setupAxios()
  }

  setupAxios () {
    this.axios = axios.create({
      baseURL: this.BASE_URL,
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


  // Generate Models
  generateModels (payload: GenerateModelPayload): Promise<{ task_id: string }> {
    const { type } = payload

    return new Promise((resolve, reject) => {
      switch (type) {
      case 'text_to_model': {
        const { prompt } = payload

        return this.axios.post('/task', {
          type,
          prompt
        })
          .then(({ data }) => {
            return resolve(data.data)
          })
          .catch((error) => reject(error))
      }
      case 'image_to_model': {
        const { file } = payload

        return this.axios.post('/task', {
          type,
          file
        })
          .then(({ data }) => {
            return resolve(data.data)
          })
          .catch((error) => reject(error))
      }
      case 'multiview_to_model': {
        const { files, mode } = payload

        return this.axios.post('/task', {
          type,
          files,
          mode
        })
          .then(({ data }) => {
            return resolve(data.data)
          })
          .catch((error) => reject(error))
      }
      }
    })
  }

  // Task Watcher
  async taskWatcher (task_id: string): Promise<{
    task_id: string
    type: string
    status: string
    prompt: string
    result: {
      model: {
        type: string
        url: string
      }
      rendered_image: {
        type: string
        url: string
      }
    }
  }> {
    return new Promise((resolve, reject) => {
      const url = `wss://api.tripo3d.ai/v2/openapi/task/watch/${task_id}`
      const headers = {
        Authorization: `Bearer ${this.apiKey}`
      }

      const ws = new WebSocket(url, { headers })

      ws.on('open', () => {
        console.log('Task watcher connected')
      })

      ws.on('message', async (message) => {
        try {
          const data = JSON.parse(message.toString());
          const status = data.data.status;
          if (status !== 'running' && status !== 'queued') {
            // console.log('data task', data.data)
            const dataModel = data.data
          
            ws.close()
            return resolve(dataModel)
          }
        } 
        catch (err) {
          console.log('Received non-JSON message: ', message)
          ws.close()
          reject(err)
        }
      })

      ws.on('error', (err) => {
        console.log('Task watcher error: ', err)
        reject(err.message)
      })
    })
  }
}