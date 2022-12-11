import { Test } from '@nestjs/testing';
import { User } from 'src/users/entities/user.entity';
import { Reminder } from './entities/reminder.entity';
import { ReminderController } from './reminder.controller';
import { ReminderService } from './reminder.service';

const mockRepository = () => ({});

describe('ReminderController', () => {
  let reminderController: ReminderController;
  let reminderService: ReminderService;
  let reminder: Reminder;
  let user: User;

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
    user = new User();
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
      const user = new User();
      jest
        .spyOn(reminderService, 'findAll')
        .mockImplementation(() => Promise.resolve(result));

      expect(await reminderController.findAll(query, user)).toBe(result);
    });
  });
});
