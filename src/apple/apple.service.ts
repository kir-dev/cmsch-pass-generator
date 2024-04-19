import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import * as fs from 'fs'
import { PKPass } from 'passkit-generator'
import * as path from 'path'

import { PassQuery, Template } from '../types/types'
import { convertHexToRgb } from '../utils/color.utils'
import { ORG_NAME, PASS_TYPE_IDENTIFIER, PASSPHRASE, TEAM_ID } from '../utils/configuration'
import generateRandomString from '../utils/randomString'

const genFolder = path.resolve(__dirname, '../../gen')

@Injectable()
export class AppleService {
  private readonly logger = new Logger(AppleService.name)

  async generatePass(template: Template, { name, userId, type }: PassQuery) {
    this.logger.log(`Generating pass for template ${template.name} with type ${type ?? 'eventTicket'}`)
    const certs = this.loadCerts()
    const pass = new PKPass({}, certs, this.getPassProps(template, userId))

    pass.type = type ?? 'eventTicket'

    pass.primaryFields.push({
      key: 'name',
      label: 'Név',
      value: name,
    })

    if (type === 'eventTicket') {
      pass.secondaryFields.push({
        key: 'eventName',
        label: 'Esemény',
        value: template.name,
      })
    }

    pass.setBarcodes({
      message: userId,
      format: 'PKBarcodeFormatQR',
    })

    const identifier = generateRandomString()
    const passFileName = `${identifier}.pkpass`
    try {
      const logoUrl = path.resolve(__dirname, '../../templates', template.id, 'logo.png')
      const logo2Url = path.resolve(__dirname, '../../templates', template.id, 'logo@2x.png')
      const iconUrl = path.resolve(__dirname, '../../templates', template.id, 'icon.png')
      const icon2Url = path.resolve(__dirname, '../../templates', template.id, 'icon@2x.png')

      pass.addBuffer('logo.png', fs.readFileSync(logoUrl))
      pass.addBuffer('icon.png', fs.readFileSync(iconUrl))

      if (fs.existsSync(logo2Url)) {
        pass.addBuffer('logo@2x.png', fs.readFileSync(logo2Url))
      }

      if (fs.existsSync(icon2Url)) {
        pass.addBuffer('icon@2x.png', fs.readFileSync(icon2Url))
      }
      return await this.writePassToFile(pass, passFileName)
    } catch (e) {
      this.logger.error(e)
      throw new InternalServerErrorException(e)
    }
  }

  private writePassToFile(pass: PKPass, passPath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(genFolder)) fs.mkdirSync(genFolder)
      const fullPath = path.resolve(genFolder, passPath)
      fs.createWriteStream(fullPath).write(pass.getAsBuffer(), err => {
        if (err) {
          reject(err)
        } else {
          resolve(fullPath)
        }
      })
    })
  }

  private loadCerts() {
    return {
      wwdr: fs.readFileSync(path.resolve(__dirname, '../../creds/wwdr.pem')),
      signerCert: fs.readFileSync(path.resolve(__dirname, '../../creds/signerCert.pem')),
      signerKey: fs.readFileSync(path.resolve(__dirname, '../../creds/signerKey.pem')),
      signerKeyPassphrase: PASSPHRASE,
    }
  }

  private getPassProps(template: Template, userId: string) {
    return {
      passTypeIdentifier: PASS_TYPE_IDENTIFIER,
      teamIdentifier: TEAM_ID,
      organizationName: ORG_NAME,
      description: template.name,
      foregroundColor: convertHexToRgb(template.foregroundColor),
      labelColor: convertHexToRgb(template.labelColor),
      backgroundColor: convertHexToRgb(template.backgroundColor),
      serialNumber: userId,
    }
  }
}
