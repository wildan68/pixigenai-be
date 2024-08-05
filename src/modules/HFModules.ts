import 'dotenv/config'
import UtilitiesModules from './UtilitiesModules.js'
import { HfInference } from '@huggingface/inference'

export default class HFModules extends UtilitiesModules {
  private apiKey: string
  private hf: HfInference

  constructor () {
    super()

    this.apiKey = process.env.HUGGINGFACE_API_KEY as string

    if (!this.apiKey) {
      throw new Error('HUGGINGFACE_API_KEY is not defined')
    }

    this.hf = new HfInference(this.apiKey)
  }

  textToImage (prompt: string, model?: string) {
    return new Promise((resolve, reject) => {
      this.hf.textToImage({
        inputs: prompt,
        model: model || 'stabilityai/stable-diffusion-2',
        parameters: {
          negative_prompt: 'blurry',
        }
      })
        .then(async (data) => {
          const buffer = Buffer.from(await data.arrayBuffer());

          return resolve({
            image: buffer.toString('base64')
          })
        })
        .catch((err) => reject(err))
    })
  }
}