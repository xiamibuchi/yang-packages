import { Test, TestingModule } from '@nestjs/testing';
import { HttpStaticController } from './http-static.controller';

describe('HttpStaticController', () => {
  let controller: HttpStaticController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HttpStaticController],
    }).compile();

    controller = module.get<HttpStaticController>(HttpStaticController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
