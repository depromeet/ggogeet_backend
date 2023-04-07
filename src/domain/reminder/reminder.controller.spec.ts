import { Test } from '@nestjs/testing';
import { User } from 'src/domain/users/entities/user.entity';
import { Reminder } from './entities/reminder.entity';
import { ReminderController } from './reminder.controller';
import { ReminderService } from './reminder.service';
import { FindAllReminderQueryDto } from './dto/requests/findAllReminder.request.dto';
import { ReminderResponseDto } from './dto/responses/reminder.response.dto';

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

    reminderService = moduleRef.get<ReminderService>(ReminderService);
    reminderController = moduleRef.get<ReminderController>(ReminderController);
    reminder = new Reminder();
    user = new User();
  });

  describe('Test FindAll', () => {
    it('should return an array of reminder', async () => {
      const query = new FindAllReminderQueryDto();
      query.done = true;
      query.page = 1;
      query.take = 10;

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

  describe('Test FindOne', () => {
    it('should return an array of reminder', async () => {
      const result = {
        data: new ReminderResponseDto(reminder),
      };
      jest
        .spyOn(reminderService, 'findOne')
        .mockImplementation(() =>
          Promise.resolve(new ReminderResponseDto(reminder)),
        );

      expect(await reminderController.findOne(1, user)).toStrictEqual(result);
    });
  });

  describe('Test Create', () => {
    it('should return reminder', async () => {
      const result = {
        data: Reminder,
      };
      jest
        .spyOn(reminderService, 'createReminder')
        .mockImplementation(() => Promise.resolve(reminder));

      expect(await reminderController.create(reminder, user)).toStrictEqual(
        result,
      );
    });
  });

  describe('Test Update', () => {
    it('should return reminder', async () => {
      const result = {
        data: Reminder,
      };
      jest
        .spyOn(reminderService, 'update')
        .mockImplementation(() => Promise.resolve(reminder));

      expect(await reminderController.update(1, reminder, user)).toStrictEqual(
        result,
      );
    });
  });
});
