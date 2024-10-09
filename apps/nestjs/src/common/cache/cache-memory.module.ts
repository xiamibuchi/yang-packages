import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    CacheModule.register({
      max: 100,
      ttl: 10 * 1000 /*milliseconds*/,
    }),
  ],
  exports: [CacheModule],
})
export class CacheMemoryModule {}
