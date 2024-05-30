import { Controller, Get, Header } from '@nestjs/common';
import { HttpStaticService } from './http-static.service';

@Controller()
export class HttpStaticController {
  constructor(private readonly httpStaticService: HttpStaticService) {}

  @Get('/')
  @Header('Content-Type', 'text/html')
  @Header('Cache-Control', 'no-cache')
  async getIndexHtml() {
    const str = await this.httpStaticService.getIndexHtmlByCache('index.html');
    return str;
  }
}
