import { Injectable, Logger } from '@nestjs/common'
import { plainToInstance } from 'class-transformer'
import * as fs from 'fs'
import * as path from 'path'

import { Template } from '../types/types'

const templatesFolderPath = path.join(__dirname, '../../templates')

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name)
  private templates: Template[] = []

  constructor() {
    this.getTemplatesFromFileSystem().then(importedTemplates => {
      this.templates = importedTemplates
      this.logger.log('Templates imported: ' + importedTemplates.length)
      if (importedTemplates.length === 0) {
        this.logger.error('No templates found. Exiting...')
        process.exit(1)
      }
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
          this.logger.error(`Error reading pass.json in '${subDir}': ${err.message}`)
        }
      }

      return importedTemplates
    } catch (err) {
      this.logger.error('Error scanning templates folder:' + err.message)
      return []
    }
  }
}
