import { Module } from '@nestjs/common'

import { AppService } from './app.service'
import { AppleModule } from './apple/apple.module'
import { ContentDeliveryModule } from './content-delivery/content-delivery.module'
import { GoogleModule } from './google/google.module'

@Module({
  imports: [AppleModule, GoogleModule, ContentDeliveryModule],
  providers: [AppService],
})
export class AppModule {}
