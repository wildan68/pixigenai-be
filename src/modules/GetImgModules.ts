import 'dotenv/config'
import axios, { AxiosInstance } from 'axios'
import UtilitiesModules from './UtilitiesModules.js'
import { DiffusionXLAttributes, DiffusionXLResponse, GetModelsRespose } from '../types/types.js'

export default class GetImgModules extends UtilitiesModules {
  private apiKey: string
  private BASE_URL = 'https://api.getimg.ai/v1'
  private axios: AxiosInstance

  constructor () {
    super()

    this.apiKey = process.env.GETIMG_API_KEY as string
    this.axios = axios

    if (!this.apiKey) {
      throw new Error('GETIMG_API_KEY is not defined')
    }

    this.setupAxios()
  }

  private setupAxios () {
    this.axios = axios.create({
      baseURL: this.BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      }
    })
  }

  getAllModel (family: 'stable-diffusion-xl' | 'stable-diffusion' | null = null): Promise<GetModelsRespose[]> {
    const query = {}

    if (family) Object.assign(query, { family })

    return new Promise((resolve, reject) => {
      this.axios.get(`/models?${this.buildQuery(query)}`)
        .then(({ data }: { data: GetModelsRespose[] }) => resolve(data))
        .catch((error) => reject(error))
    })
  }

  modelDetail (id: string): Promise<GetModelsRespose> {
    return new Promise((resolve, reject) => {
      this.axios.get(`/models/${id}`)
        .then(({ data }: { data: GetModelsRespose }) => resolve(data))
        .catch((error) => reject(error))
    })
  }

  textToImageDiffusionXL (payload: DiffusionXLAttributes): Promise<DiffusionXLResponse> {
    return new Promise((resolve, reject) => {
      this.axios.post('/stable-diffusion-xl/text-to-image', payload)
        .then(({ data }: { data: DiffusionXLResponse }) => resolve(data))
        .catch((error) => reject(error))
    })
  }
}