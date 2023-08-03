import { Controller, Get, Header, Logger, Param, StreamableFile } from '@nestjs/common'

import { ContentDeliveryService } from './content-delivery.service'

@Controller('cdn')
export class ContentDeliveryController {
  constructor(private readonly contentDeliveryService: ContentDeliveryService) {}

  @Get(':template/:fileName')
  @Header('Content-Type', 'image/png')
  getFileForTemplate(@Param('template') template: string, @Param('fileName') fileName: string) {
    const file = this.contentDeliveryService.getFileForTemplate(template, fileName)
    Logger.log(`Serving ${template}/${fileName}`, ContentDeliveryController.name)
    return new StreamableFile(file)
  }
}
