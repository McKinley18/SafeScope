import { Test, TestingModule } from '@nestjs/testing';
import { SafescopeService } from './safescope.service';

describe('SafescopeService', () => {
  let service: SafescopeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SafescopeService],
    }).compile();

    service = module.get<SafescopeService>(SafescopeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
