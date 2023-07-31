import { Module } from '@nestjs/common'

import { TemplateService } from '../template/template.service'
import { AppleController } from './apple.controller'
import { AppleService } from './apple.service';

@Module({
  controllers: [AppleController],
  providers: [TemplateService, AppleService],
})
export class AppleModule {}
