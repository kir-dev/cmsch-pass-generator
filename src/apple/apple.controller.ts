import { Controller, Get, Logger, NotFoundException, Param, Query, Response } from '@nestjs/common'
import { Response as Res } from 'express'
import * as fs from 'fs'

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
    const passPath = await this.appleService.generatePass(passConfig, query)
    Logger.log(`Generated pass for template ${passConfig.name}`, AppleController.name)
    res.sendFile(passPath, () => {
      fs.rmSync(passPath)
    })
  }
}
