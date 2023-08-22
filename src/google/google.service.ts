import { Injectable, Logger } from '@nestjs/common'
import * as fs from 'fs'
import { GoogleAuth } from 'google-auth-library'
import * as jwt from 'jsonwebtoken'
import * as path from 'path'

import { GoogleCredentials, PassQuery, Template } from '../types/types'
import { ISSUER_ID, ORG_NAME, SERVER_BASE_URL } from '../utils/configuration'

const KEY_FILE_PATH = path.resolve(__dirname, '../../creds/google.json')
const BASE_URL = 'https://walletobjects.googleapis.com/walletobjects/v1'
const CLASS_URL = `${BASE_URL}/eventTicketClass`
const OBJECT_URL = `${BASE_URL}/eventTicketObject`

@Injectable()
export class GoogleService {
  private credentials: GoogleCredentials
  private client: GoogleAuth
  constructor() {
    this.auth()
  }

  async generatePass(template: Template, query: PassQuery) {
    const passClass = await this.createClass(template)
    const passObject = await this.createObject(template, passClass.id, query.name, query.userId)
    return this.getUrlForPass(passObject, passClass)
  }

  private async createClass(template: Template) {
    const classId = `${ISSUER_ID}.${template.id}`
    const newClass = this.generateClass(template, classId)

    try {
      await this.client.request({
        url: `${CLASS_URL}/${classId}`,
        method: 'GET',
      })
      Logger.debug(`Class already exists: ${classId}`, GoogleService.name)
      return newClass
    } catch (err) {
      if (err.response && err.response.status !== 404) {
        Logger.error(err, GoogleService.name)
        return newClass
      }
    }
    try {
      await this.client.request({
        url: CLASS_URL,
        method: 'POST',
        data: newClass,
      })

      Logger.log(`Class inserted: ${classId}`, GoogleService.name)
    } catch (e) {
      Logger.error(e, GoogleService.name)
    }

    return newClass
  }

  private async createObject(template: Template, classId: string, userName: string, userId: string) {
    const objectId = `${ISSUER_ID}.${userId}`
    const newObject = this.generateObject(template, objectId, classId, userName, userId)

    try {
      await this.client.request({
        url: `${OBJECT_URL}/${objectId}`,
        method: 'GET',
      })

      Logger.debug(`Object already exists: ${objectId}`, GoogleService.name)

      return newObject
    } catch (err) {
      if (err.response && err.response.status !== 404) {
        Logger.error(err, GoogleService.name)
        return newObject
      }
    }

    try {
      await this.client.request({
        url: OBJECT_URL,
        method: 'POST',
        data: newObject,
      })

      Logger.log(`Object inserted: ${objectId}`, GoogleService.name)
    } catch (e) {
      Logger.error(e)
    }

    return newObject
  }

  private getUrlForPass(passObject: object, passClass: object) {
    const token = this.getJwt(passObject, passClass)
    return `https://pay.google.com/gp/v/save/${token}`
  }

  private getJwt(passObject: object, passClass: object) {
    const claims = {
      iss: this.credentials.client_email,
      aud: 'google',
      origins: ['www.kir-dev.hu'],
      typ: 'savetowallet',
      payload: {
        genericClasses: [passClass],
        genericObjects: [passObject],
      },
    }

    return jwt.sign(claims, this.credentials.private_key, { algorithm: 'RS256' })
  }

  private generateClass(template: Template, classId: string) {
    const passClass: Record<string, any> = {
      eventId: classId,
      eventName: {
        defaultValue: {
          language: 'hu-HU',
          value: template.name,
        },
      },
      id: classId,
      issuerName: ORG_NAME,
      reviewStatus: 'UNDER_REVIEW',
      heroImage: { sourceUri: { uri: this.getIconUrl(template.id) } },
    }
    const iconUrl = this.getIconUrl(template.id)
    if (iconUrl) passClass.logo = { sourceUri: { uri: iconUrl } }
    const bannerUrl = this.getBannerUrl(template.id)
    if (bannerUrl) passClass.heroImage = { sourceUri: { uri: bannerUrl } }
    return passClass
  }

  private generateObject(template: Template, objectId: string, classId: string, userName: string, userId: string) {
    return {
      id: objectId,
      classId: classId,
      state: 'ACTIVE',
      ticketHolderName: userName,
      barcode: {
        type: 'QR_CODE',
        value: userId,
        alternateText: userId,
      },
      hexBackgroundColor: template.backgroundColor,
    }
  }

  private auth() {
    this.credentials = require(KEY_FILE_PATH)
    this.client = new GoogleAuth({
      credentials: this.credentials,
      scopes: 'https://www.googleapis.com/auth/wallet_object.issuer',
    })
  }

  private getIconUrl(templateId: string): string | undefined {
    const urlhq = path.join(SERVER_BASE_URL, templateId, 'icon@hq.png')
    if (fs.existsSync(urlhq)) {
      return urlhq
    }
    const url2x = path.join(SERVER_BASE_URL, templateId, 'icon@2x.png')
    if (fs.existsSync(url2x)) {
      return url2x
    }
    return path.join(SERVER_BASE_URL, templateId, 'icon.png')
  }

  private getBannerUrl(templateId: string): string | undefined {
    const url = path.join(SERVER_BASE_URL, templateId, 'banner.png')
    if (fs.existsSync(url)) {
      return url
    }
  }
}
