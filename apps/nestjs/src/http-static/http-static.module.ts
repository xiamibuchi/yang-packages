import { Module } from '@nestjs/common';
import { HttpStaticController } from './http-static.controller';
import { HttpStaticService } from './http-static.service';
import { CacheMemoryModule } from '@/common/cache/cache-memory.module';

@Module({
  imports: [CacheMemoryModule],
  controllers: [HttpStaticController],
  providers: [HttpStaticService],
})
export class HttpStaticModule {}
