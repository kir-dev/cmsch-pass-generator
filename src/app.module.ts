import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common'

import { AnalyticsMiddleware } from './analytics/analytics.middleware'
import { AppController } from './app.controller'
import { AppleModule } from './apple/apple.module'
import { ContentDeliveryModule } from './content-delivery/content-delivery.module'
import { GoogleModule } from './google/google.module'
import { TemplateModule } from './template/template.module'

@Module({
  controllers: [AppController],
  imports: [AppleModule, GoogleModule, ContentDeliveryModule, TemplateModule],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(AnalyticsMiddleware).forRoutes({ path: '*', method: RequestMethod.GET })
  }
}
