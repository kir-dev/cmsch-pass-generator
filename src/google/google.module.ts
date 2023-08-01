import { Module } from '@nestjs/common'

import { TemplateModule } from '../template/template.module'
import { GoogleController } from './google.controller'
import { GoogleService } from './google.service'

@Module({
  imports: [TemplateModule],
  controllers: [GoogleController],
  providers: [GoogleService],
})
export class GoogleModule {}
