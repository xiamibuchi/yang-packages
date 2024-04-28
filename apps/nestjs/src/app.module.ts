import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpStaticModule } from './http-static/http-static.module';

@Module({
  imports: [HttpStaticModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
