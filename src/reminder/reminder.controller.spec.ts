import { Test } from '@nestjs/testing';
import { Reminder } from './entities/reminder.entity';
import { ReminderController } from './reminder.controller';
import { ReminderService } from './reminder.service';

const mockRepository = () => ({});

describe('ReminderController', () => {
  let reminderController: ReminderController;
  let reminderService: ReminderService;
  let reminder: Reminder;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ReminderController],
      providers: [
        ReminderService,
        {
          provide: 'ReminderRepository',
          useFactory: mockRepository,
        },
        {
          provide: 'UserRepository',
          useFactory: mockRepository,
        },
      ],
    }).compile();

    // add dependency of notice service

    reminderService = moduleRef.get<ReminderService>(ReminderService);
    reminderController = moduleRef.get<ReminderController>(ReminderController);
    reminder = new Reminder();
  });

  describe('Test FindAll', () => {
    it('should return an array of reminder', async () => {
      const query = {
        offset: Number(),
        limit: Number(),
        done: Boolean(),
      };
      const result = {
        count: Number(),
        offset: Number(),
        limit: Number(),
        data: Reminder[10],
      };
      jest
        .spyOn(reminderService, 'findAll')
        .mockImplementation(() => Promise.resolve(result));

      expect(await reminderController.findAll(query)).toBe(result);
    });
  });

  describe('Test FindOne', () => {
    it('should return a reminder', async () => {
      jest
        .spyOn(reminderService, 'findOne')
        .mockImplementation(() => Promise.resolve(reminder));

      expect(await reminderController.findOne(1)).toBe(reminder);
    });
  });

  describe('Test Create', () => {
    it('should create a reminder', async () => {
      jest
        .spyOn(reminderService, 'createReminder')
        .mockImplementation(() => Promise.resolve(reminder));

      expect(await reminderController.create(reminder)).toBe(reminder);
    });
  });
});
