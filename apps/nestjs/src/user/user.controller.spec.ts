import { Test, TestingModule } from '@nestjs/testing';
import { CacheMemoryModule } from '../common/cache/cache-memory.module';
import { UserController } from './user.controller';
import { UserService } from '@/user/user.service';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      imports: [CacheMemoryModule],
      providers: [UserService],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
