import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common'
import * as fs from 'fs'
import { PKPass } from 'passkit-generator'
import * as path from 'path'

import { PassQuery, Template } from '../types/types'
import { ORG_NAME, PASS_TYPE_IDENTIFIER, PASSPHRASE, TEAM_ID } from '../utils/configuration'
import generateRandomString from '../utils/randomString'

const genFolder = path.resolve(__dirname, '../../gen')

@Injectable()
export class AppleService {
  async generatePass(template: Template, { name, userId }: PassQuery) {
    const certs = this.loadCerts()
    const pass = new PKPass({}, certs, this.getPassProps(template, userId))

    pass.type = 'generic'

    pass.primaryFields.push({
      key: 'name',
      label: 'Név',
      value: name,
    })

    pass.setBarcodes({
      message: userId,
      format: 'PKBarcodeFormatQR',
    })

    const identifier = generateRandomString()
    const passFileName = `${identifier}.pkpass`
    try {
      pass.addBuffer('logo.png', fs.readFileSync(path.resolve(__dirname, '../../templates', template.id, 'logo.png')))
      pass.addBuffer('icon.png', fs.readFileSync(path.resolve(__dirname, '../../templates', template.id, 'icon.png')))
      const passPath = await this.writePassToFile(pass, passFileName)
      const passFile = fs.readFileSync(passPath)
      fs.rmSync(passPath)
      return passFile
    } catch (e) {
      Logger.error(e)
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
      logoText: template.name,
      foregroundColor: template.foregroundColor,
      labelColor: template.labelColor,
      backgroundColor: template.backgroundColor,
      serialNumber: userId,
    }
  }
}
