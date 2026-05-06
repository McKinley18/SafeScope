import { Test, TestingModule } from '@nestjs/testing';
import { SafescopeController } from './safescope.controller';

describe('SafescopeController', () => {
  let controller: SafescopeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SafescopeController],
    }).compile();

    controller = module.get<SafescopeController>(SafescopeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
