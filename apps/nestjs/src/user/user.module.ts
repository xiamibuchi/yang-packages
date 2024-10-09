import { Module } from '@nestjs/common';
import { CacheRedisModule } from '../common/cache/cache-redis.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [CacheRedisModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
