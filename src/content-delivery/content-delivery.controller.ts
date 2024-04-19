import { Controller, Get, Header, Logger, Param, StreamableFile } from '@nestjs/common'

import { ContentDeliveryService } from './content-delivery.service'

@Controller('cdn')
export class ContentDeliveryController {
  private readonly logger = new Logger(ContentDeliveryController.name)
  constructor(private readonly contentDeliveryService: ContentDeliveryService) {}

  @Get(':template/:fileName')
  @Header('Content-Type', 'image/png')
  getFileForTemplate(@Param('template') template: string, @Param('fileName') fileName: string) {
    const file = this.contentDeliveryService.getFileForTemplate(template, fileName)
    this.logger.log(`Serving ${template}/${fileName}`)
    return new StreamableFile(file)
  }
}
