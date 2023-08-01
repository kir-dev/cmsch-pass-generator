import { Injectable, Logger } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import * as fs from 'fs'
import * as path from 'path'

import { Template } from '../types/types'

const templatesFolderPath = path.join(__dirname, '../../templates')

@Injectable()
export class TemplateService {
  private templates: Template[] = []

  constructor() {
    this.getTemplatesFromFileSystem().then(importedTemplates => {
      this.templates = importedTemplates
      Logger.log('Templates imported: ' + importedTemplates.length, TemplateService.name)
    })
  }

  getTemplates(): Template[] {
    return this.templates
  }

  getTemplateForId(id: string): Template | undefined {
    return this.templates.find(template => template.id === id)
  }

  private async getTemplatesFromFileSystem() {
    try {
      const subDirectories = await fs.promises.readdir(templatesFolderPath)
      const subDirs = subDirectories.filter(item => fs.statSync(path.join(templatesFolderPath, item)).isDirectory())

      const importedTemplates: Template[] = []

      for (const subDir of subDirs) {
        const passJsonPath = path.join(templatesFolderPath, subDir, 'pass.json')

        try {
          await fs.promises.access(passJsonPath, fs.constants.F_OK)
          const passJsonContent = await fs.promises.readFile(passJsonPath, 'utf8')
          const passJsonData = JSON.parse(passJsonContent)
          const templateData = plainToInstance(Template, { id: subDir, ...passJsonData }, { excludeExtraneousValues: true })
          importedTemplates.push(templateData)
        } catch (err) {
          Logger.error(`Error reading pass.json in '${subDir}': ${err.message}`)
        }
      }

      return importedTemplates
    } catch (err) {
      Logger.error('Error scanning templates folder:', err.message)
      return []
    }
  }
}
