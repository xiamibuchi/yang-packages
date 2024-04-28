import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { STATIC_PATH } from '../constant/config';
import { HttpStaticController } from './http-static.controller';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: STATIC_PATH,
    }),
  ],
  controllers: [HttpStaticController],
  providers: [],
})
export class HttpStaticModule {}
