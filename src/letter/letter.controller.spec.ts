import { Test, TestingModule } from '@nestjs/testing';
import { LetterController } from './letter.controller';

describe('LetterController', () => {
  let controller: LetterController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LetterController],
    }).compile();

    controller = module.get<LetterController>(LetterController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
