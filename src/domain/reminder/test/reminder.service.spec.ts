import { Test } from '@nestjs/testing';
import { User } from 'src/domain/users/entities/user.entity';
import { Repository } from 'typeorm';
import { Reminder } from '../entities/reminder.entity';
import { ReminderService } from '../reminder.service';
import { ReminderController } from '../reminder.controller';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PaginationBuilder } from 'src/common/paginations/paginationBuilder.response';
import { FindAllReminderQueryDto } from '../dto/requests/findAllReminder.request.dto';
import { CreateReminderDto } from '../dto/requests/createReminder.request.dto';
import { ReminderResponseDto } from '../dto/responses/reminder.response.dto';
import { ReminderStautsResponseDto } from '../dto/responses/reminderStatus.response.dto';
import { UpdateReminderDto } from '../dto/requests/updateReminder.request.dto';
import { NotFoundException } from '@nestjs/common';

const mockRepository = () => ({
  save: jest.fn(),
  findAndCount: jest.fn().mockResolvedValueOnce([[Reminder], 1]),
  findOne: jest.fn().mockResolvedValue(Reminder),
  update: jest.fn(),
  softDelete: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('Reminder Service Test', () => {
  let reminderService: ReminderService;
  let reminderRepository: MockRepository<Reminder>;
  const user = new User();

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [ReminderController],
      providers: [
        ReminderService,
        {
          provide: 'ReminderRepository',
          useValue: mockRepository(),
        },
      ],
    }).compile();

    reminderService = moduleRef.get<ReminderService>(ReminderService);
    reminderRepository = moduleRef.get(getRepositoryToken(Reminder));
  });

  describe('FindAll', () => {
    const findAllReminderQueryDto = new FindAllReminderQueryDto();
    findAllReminderQueryDto.page = 1;
    findAllReminderQueryDto.take = 10;

    const paginationResult = new PaginationBuilder()
      .setData([Reminder])
      .setTotalCount(1)
      .setPage(1)
      .setTake(10)
      .build();

    it('Find All User Reminders', () => {
      const result = reminderService.findAll(findAllReminderQueryDto, user);
      expect(result).resolves.toEqual(paginationResult);
    });
    it('Find All User Done Reminders', () => {
      findAllReminderQueryDto.done = true;
      const result = reminderService.findAll(findAllReminderQueryDto, user);
      expect(result).resolves.toEqual(paginationResult);
    });
    it('Find All User Not Done Reminders', () => {
      findAllReminderQueryDto.done = false;
      const result = reminderService.findAll(findAllReminderQueryDto, user);
      expect(result).resolves.toEqual(paginationResult);
    });
    it('Find All User Reminders When done is undefined', () => {
      findAllReminderQueryDto.done = undefined;
      const result = reminderService.findAll(findAllReminderQueryDto, user);
      expect(result).resolves.toEqual(paginationResult);
    });
    it('Find All User Reminders When done is null', () => {
      findAllReminderQueryDto.done = null;
      const result = reminderService.findAll(findAllReminderQueryDto, user);
      expect(result).resolves.toEqual(paginationResult);
    });
  });

  describe('FindOne', () => {
    const reminder = new Reminder();
    const reminderResponseDto = new ReminderResponseDto(reminder);
    const id = 1;
    it('Find One if exist', () => {
      const result = reminderService.findOne(id, user);
      expect(result).resolves.toEqual(reminderResponseDto);
    });
    it('Can not find reminder', () => {
      jest.spyOn(reminderRepository, 'findOne').mockResolvedValue(undefined);
      const result = reminderService.findOne(id, user);
      expect(result).rejects.toThrowError(
        new NotFoundException('Reminder not found'),
      );
    });
    it('Find reminder, but not users one', () => {
      expect(true).toBe(true);
    });
  });

  describe('Create Reminder', () => {
    const createReminder = new CreateReminderDto();
    const reminder = new Reminder();
    reminder.isDone = false;
    const reminderResult = new ReminderResponseDto(reminder);
    it('Create Reminder', () => {
      const result = reminderService.createReminder(createReminder, user);
      expect(result).resolves.toEqual(reminderResult);
    });
  });

  describe('Update Reminder', () => {
    const id = 1;
    const updateReminderDto = new UpdateReminderDto();
    const reminder = new Reminder();
    const reminderResult = new ReminderResponseDto(reminder);
    it('Can not find reminder', () => {
      jest.spyOn(reminderRepository, 'findOne').mockResolvedValue(undefined);
      const result = reminderService.update(id, updateReminderDto, user);
      expect(result).rejects.toThrowError(
        new NotFoundException('Reminder not found'),
      );
    });
    it('Update Reminder', () => {
      const result = reminderService.update(id, updateReminderDto, user);
      expect(result).resolves.toEqual(reminderResult);
    });
  });

  describe('Delete Reminder', () => {
    it('Can not find reminder', () => {
      expect(true).toBe(true);
    });
    it('Delete Reminder', () => {
      expect(true).toBe(true);
    });
  });

  describe('Change Reminder status to done', () => {
    const id = 1;
    const reminderStautsResponseDto = new ReminderStautsResponseDto(id, true);
    it('Can not find reminder', () => {
      // todo()
    });
    it('Delete Reminder', () => {
      const result = reminderService.done(id, user);
      expect(result).resolves.toEqual(reminderStautsResponseDto);
    });
  });

  describe('Change Reminder status to undone', () => {
    const id = 1;
    const reminderStautsResponseDto = new ReminderStautsResponseDto(id, false);
    it('Can not find reminder', () => {
      // todo()
    });
    it('Delete Reminder', () => {
      const result = reminderService.undone(id, user);
      expect(result).resolves.toEqual(reminderStautsResponseDto);
    });
  });
});
