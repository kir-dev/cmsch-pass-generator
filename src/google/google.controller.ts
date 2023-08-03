import { Controller, Get, Logger, NotFoundException, Param, Query, Res } from '@nestjs/common'

import { TemplateService } from '../template/template.service'
import { PassQuery } from '../types/types'
import { GoogleService } from './google.service'

@Controller('google')
export class GoogleController {
  constructor(
    private readonly googleService: GoogleService,
    private readonly templateService: TemplateService
  ) {}

  @Get(':templateId')
  async getPass(@Res() res, @Query() query: PassQuery, @Param('templateId') templateId: string) {
    const passConfig = this.templateService.getTemplateForId(templateId)
    if (!passConfig) throw new NotFoundException('Template not found')
    const url = await this.googleService.generatePass(passConfig, query)
    Logger.log(`Generated pass for template ${passConfig.name}`, GoogleController.name)
    res.redirect(url)
  }
}
