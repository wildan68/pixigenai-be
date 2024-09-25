import UtilitiesModules from './UtilitiesModules.js'
import Cloudinary, { UploadApiResponse } from 'cloudinary'
import multer from 'multer'
import path from 'path'

export default class CloudinaryModules extends UtilitiesModules {
  private apiKey: string
  private cloudinary = Cloudinary.v2
  private multer = multer({ dest: path.join(__dirname, '/tmp') })
  
  constructor() {
    super()

    this.apiKey = process.env.CLOUDINARY_URL as string

    if (!this.apiKey) {
      throw new Error('CLOUDINARY_URL is not defined')
    }

    this.cloudinary.config({ secure: true,  })
  }

  uploadImage ({ filePath, folder }: { filePath: string, folder: string }): Promise<UploadApiResponse | undefined> {
    return new Promise((resolve, reject) => {
      this.cloudinary.uploader.upload(filePath, { folder }, (err, result) => {
        if (err) return reject(err)

        return resolve(result)
      })
    })
  }
}