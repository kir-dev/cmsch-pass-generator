import { Controller, Get, Logger, NotFoundException, Param, Query, Res } from '@nestjs/common'
import { Response } from 'express'

import { TemplateService } from '../template/template.service'
import { PassQuery } from '../types/types'
import { GoogleService } from './google.service'

@Controller('google')
export class GoogleController {
  private readonly logger = new Logger(GoogleController.name)
  constructor(
    private readonly googleService: GoogleService,
    private readonly templateService: TemplateService
  ) {}

  @Get(':templateId')
  async getPass(@Res() res: Response, @Query() query: PassQuery, @Param('templateId') templateId: string) {
    const passConfig = this.templateService.getTemplateForId(templateId)
    if (!passConfig) throw new NotFoundException('Template not found')
    const url = await this.googleService.generatePass(passConfig, query)
    this.logger.log(`Generated pass for template ${passConfig.name}`)
    res.redirect(url)
  }
}
