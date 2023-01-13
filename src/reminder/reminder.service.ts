import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateReminderDto } from './dto/requests/createReminder.request.dto';
import { Reminder } from './entities/reminder.entity';
import { UpdateReminderDto } from './dto/requests/updateReminder.request.dto';
import { ReminderResponseDto } from './dto/responses/reminder.response.dto';
import { ReminderStautsResponseDto } from './dto/responses/reminderStatus.response.dto';
import { FindAllReminderQueryDto } from './dto/requests/findAllReminder.request.dto';
import { PaginationBuilder } from 'src/common/paginations/paginationBuilder.response';

@Injectable()
export class ReminderService {
  constructor(
    @InjectRepository(Reminder)
    private reminderRepository: Repository<Reminder>,
  ) {}

  async createReminder(reminderDto: CreateReminderDto, user: User) {
    const reminder = new Reminder();
    reminder.title = reminderDto.title;
    reminder.content = reminderDto.content;
    reminder.eventAt = reminderDto.eventAt;
    reminder.alertOn = reminderDto.alertOn;
    reminder.alarmAt = reminderDto.alarmAt;
    reminder.isDone = false;
    reminder.user = user;
    reminder.situationId = reminderDto.situationId;
    return this.reminderRepository.save(reminder);
  }

  async findAll(query: FindAllReminderQueryDto, user: User) {
    const constraint = {
      user: {
        id: user.id,
      },
    };

    if (query.done !== undefined) {
      constraint['isDone'] = query.done;
    }

    const take = query.getTake();
    const skip = query.getSkip();

    const [data, count] = await this.reminderRepository.findAndCount({
      where: constraint,
      skip: skip,
      take: take,
      select: [
        'id',
        'title',
        'content',
        'eventAt',
        'alertOn',
        'isDone',
        'situationId',
      ],
    });

    return new PaginationBuilder()
      .setData(data)
      .setTotalCount(count)
      .setPage(query.getPage())
      .setTake(query.getTake())
      .build();
  }

  async findOne(id: number, user: User): Promise<ReminderResponseDto> {
    const reminder = await this.reminderRepository.findOne({
      where: {
        id: id,
        user: {
          id: user.id,
        },
      },
      select: [
        'id',
        'title',
        'content',
        'eventAt',
        'alertOn',
        'alarmAt',
        'isDone',
        'situationId',
      ],
    });
    if (!reminder) {
      throw new NotFoundException('Reminder not found');
    }

    return new ReminderResponseDto(reminder);
  }

  async update(
    id: number,
    updateReminderDto: UpdateReminderDto,
    user: User,
  ): Promise<ReminderResponseDto> {
    const reminder = await this.reminderRepository.findOne({
      where: {
        id: id,
        user: {
          id: user.id,
        },
      },
    });

    if (!reminder) {
      throw new NotFoundException('Reminder not found');
    }

    reminder.title = updateReminderDto.title
      ? updateReminderDto.title
      : reminder.title;
    reminder.content = updateReminderDto.content
      ? updateReminderDto.content
      : reminder.content;
    reminder.eventAt = updateReminderDto.eventAt
      ? updateReminderDto.eventAt
      : reminder.eventAt;
    reminder.alertOn = updateReminderDto.alertOn
      ? updateReminderDto.alertOn
      : reminder.alertOn;
    reminder.alarmAt = updateReminderDto.alarmAt
      ? updateReminderDto.alarmAt
      : reminder.alarmAt;
    reminder.situationId = updateReminderDto.situationId
      ? updateReminderDto.situationId
      : reminder.situationId;

    await this.reminderRepository.save(reminder);

    return new ReminderResponseDto(reminder);
  }

  async delete(id: number, user: User) {
    await this.reminderRepository.softDelete({
      id: id,
      user: {
        id: user.id,
      },
    });
  }

  async done(id: number, user: User) {
    await this.reminderRepository.update(
      {
        id: id,
        user: {
          id: user.id,
        },
      },
      { isDone: true },
    );
    return new ReminderStautsResponseDto(id, true);
  }

  async undone(id: number, user: User) {
    await this.reminderRepository.update(
      {
        id: id,
        user: {
          id: user.id,
        },
      },
      { isDone: false },
    );
    return new ReminderStautsResponseDto(id, false);
  }
}
