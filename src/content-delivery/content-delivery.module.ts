import { Module } from '@nestjs/common'

import { ContentDeliveryController } from './content-delivery.controller'
import { ContentDeliveryService } from './content-delivery.service'

@Module({
  controllers: [ContentDeliveryController],
  providers: [ContentDeliveryService],
})
export class ContentDeliveryModule {}
