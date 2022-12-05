import { Test, TestingModule } from '@nestjs/testing';
import { LetterService } from './letter.service';

describe('LetterService', () => {
  let service: LetterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LetterService],
    }).compile();

    service = module.get<LetterService>(LetterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
