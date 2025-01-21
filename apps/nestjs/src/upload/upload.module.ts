import { Module } from '@nestjs/common';
import { UserController } from './upload.controller';
import { UserService } from './upload.service';

@Module({
  imports: [],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
