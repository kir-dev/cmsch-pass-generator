import { Controller, Get, Header, NotFoundException, Param, Query, StreamableFile } from '@nestjs/common'

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
  @Header('Content-Disposition', 'attachment; filename="pass.pkpass"')
  async getPass(@Query() query: PassQuery, @Param('templateId') templateId: string) {
    const passConfig = this.templateService.getTemplateForId(templateId)
    if (!passConfig) throw new NotFoundException('Template not found')
    const pass = await this.appleService.generatePass(passConfig, query)
    return new StreamableFile(pass)
  }
}
