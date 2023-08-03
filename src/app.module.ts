import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AppleModule } from './apple/apple.module'
import { ContentDeliveryModule } from './content-delivery/content-delivery.module'
import { GoogleModule } from './google/google.module'
import { TemplateModule } from './template/template.module'

@Module({
  controllers: [AppController],
  imports: [AppleModule, GoogleModule, ContentDeliveryModule, TemplateModule],
  providers: [AppService],
})
export class AppModule {}
