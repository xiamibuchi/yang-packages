import { Test, TestingModule } from '@nestjs/testing';
import { CacheMemoryModule } from '../common/cache/cache-memory.module';
import { HttpStaticController } from './http-static.controller';
import { HttpStaticService } from './http-static.service';

describe('HttpStaticController', () => {
  let controller: HttpStaticController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HttpStaticController],
      imports: [CacheMemoryModule],
      providers: [HttpStaticService],
    }).compile();

    controller = module.get<HttpStaticController>(HttpStaticController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
