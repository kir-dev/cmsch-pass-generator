import { Injectable, NotFoundException } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class ContentDeliveryService {
  getFileForTemplate(template: string, fileName: string) {
    const url = path.resolve(__dirname, `../../templates/${template}/${fileName}`)
    if (!fs.existsSync(url)) {
      throw new NotFoundException()
    }
    return fs.readFileSync(url)
  }
}
