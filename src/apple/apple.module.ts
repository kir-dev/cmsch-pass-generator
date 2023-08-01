import { Module } from '@nestjs/common'

import { TemplateModule } from '../template/template.module'
import { AppleController } from './apple.controller'
import { AppleService } from './apple.service'

@Module({
  imports: [TemplateModule],
  controllers: [AppleController],
  providers: [AppleService],
})
export class AppleModule {}
