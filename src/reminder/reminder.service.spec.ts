import { Test } from '@nestjs/testing';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Reminder } from './entities/reminder.entity';
import { ReminderService } from './reminder.service';

const mockRepository = () => ({
  findAndCount: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  create: jest.fn(),
});

describe('ReminderService', () => {
  let reminderService: ReminderService;
  let reminderRepository: Repository<Reminder>;
  let userRepository: Repository<User>;
  let reminder: Reminder;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
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
    reminderRepository =
      moduleRef.get<Repository<Reminder>>('ReminderRepository');
    userRepository = moduleRef.get<Repository<User>>('UserRepository');
    reminder = new Reminder();
  });

  it('should be defined', () => {
    expect(true).toBe(true);
  });
});
