import { Test, TestingModule } from '@nestjs/testing';
import { SentenceController } from './sentence.controller';

describe('SentenceController', () => {
  let controller: SentenceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SentenceController],
    }).compile();

    controller = module.get<SentenceController>(SentenceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
