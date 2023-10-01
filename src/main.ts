import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'

import { AppModule } from './app.module'
import { BACKEND_PORT, NODE_ENV } from './utils/configuration'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  Logger.log(`Starting app in ${NODE_ENV.toUpperCase()} mode`, 'Main')
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  app.enableShutdownHooks()
  await app.listen(BACKEND_PORT)
}

bootstrap().then(() => Logger.log(`Server started on port ${BACKEND_PORT}`, 'Main'))
