import { Controller, Get, Header, HttpCode, Req, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { proxyToBing } from '@/utils/proxy';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health-check')
  @HttpCode(200)
  healthCheck(): string {
    return this.appService.healthCheck();
  }

  @Get('stream')
  @Header('Content-Type', 'text/html')
  @Header('Transfer-Encoding', 'chunked')
  async getStreamingHtml(@Res() res) {
    const head = `<!DOCTYPE html>
    <html lang="en">
    
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>HTML DEMO</title>
      <script>console.log(Date.now())</script>
    </head>`;
    const body = `
    <body>
    <h1>HTML DEMOtesttesttesttesttesttesttesttesttesttesttesttest</h1>
    <h1>HTML DEMOtesttesttesttesttesttesttesttesttesttesttesttest</h1>
    <h1>HTML DEMOtesttesttesttesttesttesttesttesttesttesttesttest</h1>
    <h1>HTML DEMOtesttesttesttesttesttesttesttesttesttesttesttest</h1>
      <script>document.documentElement.style.background = 'green'</script>
      <script>console.log(Date.now())</script>
    </body>
    </html>`;
    res.write(head);
    setTimeout(() => {
      res.write(body);
      res.end();
    }, 2000);
  }

  @Get('bing')
  async getBing(@Req() req, @Res() res) {
    return proxyToBing(req, res, () => {});
  }
}
