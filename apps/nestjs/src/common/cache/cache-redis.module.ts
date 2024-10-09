import * as redisStore from 'cache-manager-redis-store';
import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    CacheModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        ttl: 10 * 60, // default expiration time(seconds)
        store: redisStore,
        host: config.get('redis.host'),
        port: config.get('redis.port'),
        auth_pass: config.get('redis.password'),
      }),
    }),
  ],
  exports: [CacheModule],
})
export class CacheRedisModule {}
