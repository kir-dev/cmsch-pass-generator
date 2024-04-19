import { Controller, Get, Logger, NotFoundException, Param, Query, Res } from '@nestjs/common'
import { Response } from 'express'
import * as fs from 'fs'

import { TemplateService } from '../template/template.service'
import { PassQuery } from '../types/types'
import { slugifyString } from '../utils/common.utils'
import { AppleService } from './apple.service'

@Controller('apple')
export class AppleController {
  private readonly logger = new Logger(AppleController.name)

  constructor(
    private readonly templateService: TemplateService,
    private readonly appleService: AppleService
  ) {}

  @Get(':templateId')
  async getPass(@Res() res: Response, @Query() query: PassQuery, @Param('templateId') templateId: string) {
    const passConfig = this.templateService.getTemplateForId(templateId)
    if (!passConfig) throw new NotFoundException('Template not found')
    const passPath = await this.appleService.generatePass(passConfig, query)
    this.logger.log(`Generated pass for template ${passConfig.name}`)
    res.set({
      'Content-Type': 'application/vnd.apple.pkpass',
      'Content-Disposition': `attachment; filename=${slugifyString(passConfig.name)}.pkpass`,
    })
    res.sendFile(passPath, () => {
      fs.rmSync(passPath)
    })
  }
}
