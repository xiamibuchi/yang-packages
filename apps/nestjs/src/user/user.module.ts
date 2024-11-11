import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CacheRedisModule } from '@/common/cache/cache-redis.module';

@Module({
  imports: [CacheRedisModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
