import { Controller, Get } from '@nestjs/common'

import { AppService } from './app.service'
import { TemplateService } from './template/template.service'
import { ORG_NAME } from './utils/configuration'

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly templateService: TemplateService
  ) {}

  @Get('hi')
  getHi() {
    return 'Hi!'
  }

  @Get('info')
  getInfo() {
    return {
      templates: this.templateService.getTemplates(),
      organizationName: ORG_NAME,
    }
  }
}
