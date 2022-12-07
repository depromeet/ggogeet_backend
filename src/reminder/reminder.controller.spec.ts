import { Test, TestingModule } from '@nestjs/testing';
import { ReminderController } from './reminder.controller';

describe('ReminderController', () => {
  let controller: ReminderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReminderController],
    }).compile();

    controller = module.get<ReminderController>(ReminderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
