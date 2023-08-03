import { Controller, Get, Logger, NotFoundException, Param, Query, Response, StreamableFile } from '@nestjs/common'
import { Response as Res } from 'express'

import { TemplateService } from '../template/template.service'
import { PassQuery } from '../types/types'
import { AppleService } from './apple.service'

@Controller('apple')
export class AppleController {
  constructor(
    private readonly templateService: TemplateService,
    private readonly appleService: AppleService
  ) {}

  @Get(':templateId')
  async getPass(@Response() res: Res, @Query() query: PassQuery, @Param('templateId') templateId: string) {
    const passConfig = this.templateService.getTemplateForId(templateId)
    if (!passConfig) throw new NotFoundException('Template not found')
    const pass = await this.appleService.generatePass(passConfig, query)
    Logger.log(`Generated pass for template ${passConfig.name}`, AppleController.name)
    res.set('Content-Disposition', 'attachment; filename="pass.pkpass"')
    return new StreamableFile(pass)
  }
}
