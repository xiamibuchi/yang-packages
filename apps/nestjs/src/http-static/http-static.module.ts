import { Module } from '@nestjs/common';
import { CacheMemoryModule } from '../common/cache/cache-memory.module';
import { HttpStaticController } from './http-static.controller';
import { HttpStaticService } from './http-static.service';

@Module({
  imports: [CacheMemoryModule],
  controllers: [HttpStaticController],
  providers: [HttpStaticService],
})
export class HttpStaticModule {}
