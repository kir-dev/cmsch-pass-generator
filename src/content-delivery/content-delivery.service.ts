import { Injectable, NotFoundException } from '@nestjs/common'
import * as fs from 'fs'
import * as path from 'path'

@Injectable()
export class ContentDeliveryService {
  getFileForTemplate(template: string, fileName: string) {
    if (!fs.existsSync(path.resolve(`../../templates/${template}/${fileName}`))) {
      throw new NotFoundException()
    }
    return fs.readFileSync(path.resolve(`../../templates/${template}/${fileName}`))
  }
}
