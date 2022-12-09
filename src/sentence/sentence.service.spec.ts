import { Test, TestingModule } from '@nestjs/testing';
import { SentenceService } from './sentence.service';

describe('SentenceService', () => {
  let service: SentenceService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SentenceService],
    }).compile();

    service = module.get<SentenceService>(SentenceService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
