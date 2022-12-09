import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Situation } from 'src/situation/entities/situation.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { Reminder } from './entities/reminder.entity';

@Injectable()
export class ReminderService {
  constructor(
    @InjectRepository(Reminder)
    private reminderRepository: Repository<Reminder>,
    @InjectRepository(Situation)
    private situationRepository: Repository<Situation>,
  ) {}

  async createReminder(reminderDto: CreateReminderDto, user: User) {
    const reminder = new Reminder();
    reminder.title = reminderDto.title;
    reminder.content = reminderDto.content;
    reminder.event_at = reminderDto.event_at;
    reminder.alert_on = reminderDto.alert_on;
    reminder.alarm_at = reminderDto.alarm_at;
    reminder.is_done = false;
    reminder.user = user;
    reminder.situation = await this.situationRepository.findOne({
      where: {
        id: reminderDto.situation_id,
      },
    });
    return this.reminderRepository.save(reminder);
  }

  async findAll(query: any, user: User) {
    const limit: number = query.limit ? parseInt(query.limit) : 20;
    const offset: number = query.offset ? parseInt(query.offset) : 0;
    const order = query.order ? query.order : 'DESC';

    const constraint = {
      user: {
        id: user.id,
      },
    };

    if (query.done) {
      constraint['is_done'] = query.done == 'true';
    }

    const reminder = await this.reminderRepository.findAndCount({
      where: constraint,
      skip: offset,
      take: limit,
      order: {
        event_at: order,
        is_done: 'ASC',
      },
      select: ['id', 'title', 'event_at', 'alert_on', 'is_done'],
    });

    return {
      count: reminder[1],
      offset: offset,
      limit: limit,
      data: reminder[0],
    };
  }

  async findOne(id: number, user: User) {
    const reminder = await this.reminderRepository.findOne({
      where: {
        id: id,
        user: {
          id: user.id,
        },
      },
      relations: ['situation'],
      select: [
        'id',
        'title',
        'content',
        'event_at',
        'alert_on',
        'alarm_at',
        'is_done',
        'situation',
      ],
    });
    if (!reminder) {
      throw new NotFoundException('Reminder not found');
    }

    const result = {
      id: reminder.id,
      title: reminder.title,
      content: reminder.content,
      event_at: reminder.event_at,
      alert_on: reminder.alert_on,
      alarm_at: reminder.alarm_at,
      is_done: reminder.is_done,
      situation: reminder.situation.content,
    };

    return result;
  }

  async update(id: number, updateReminderDto: UpdateReminderDto, user: User) {
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
    reminder.event_at = updateReminderDto.event_at
      ? updateReminderDto.event_at
      : reminder.event_at;
    reminder.alert_on = updateReminderDto.alert_on
      ? updateReminderDto.alert_on
      : reminder.alert_on;
    reminder.alarm_at = updateReminderDto.alarm_at
      ? updateReminderDto.alarm_at
      : reminder.alarm_at;
    reminder.situation = updateReminderDto.situation_id
      ? await this.situationRepository.findOne({
          where: {
            id: updateReminderDto.situation_id,
          },
        })
      : reminder.situation;

    await this.reminderRepository.save(reminder);

    return {
      id: id,
      title: reminder.title,
      content: reminder.content,
      event_at: reminder.event_at,
      alert_on: reminder.alert_on,
      alarm_at: reminder.alarm_at,
      is_done: reminder.is_done,
      situation: reminder.situation.content,
    };
  }

  async delete(id: number, user: User) {
    await this.reminderRepository.softDelete(id);
    return {
      id: id,
      is_deleted: true,
    };
  }

  async done(id: number, user: User) {
    await this.reminderRepository.update(
      {
        id: id,
        user: {
          id: user.id,
        },
      },
      { is_done: true },
    );
    return {
      id: id,
      is_done: true,
    };
  }

  async undone(id: number, user: User) {
    await this.reminderRepository.update(
      {
        id: id,
        user: {
          id: user.id,
        },
      },
      { is_done: false },
    );
    return {
      id: id,
      is_done: false,
    };
  }
}
