import { Module } from '@nestjs/common'

import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AppleModule } from './apple/apple.module';

@Module({
  imports: [AppleModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
