import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Situation } from 'src/situation/entities/situation.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateReminderDto } from './dto/createReminder.dto';
import { UpdateReminderDto } from './dto/updateReminder.dto';
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
    reminder.eventAt = reminderDto.eventAt;
    reminder.alertOn = reminderDto.alertOn;
    reminder.alarmAt = reminderDto.alarmAt;
    reminder.isDone = false;
    reminder.user = user;
    reminder.situation = await this.situationRepository.findOne({
      where: {
        id: reminderDto.situationId,
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
      constraint['isDone'] = query.done == 'true';
    }

    const reminder = await this.reminderRepository.findAndCount({
      where: constraint,
      skip: offset,
      take: limit,
      order: {
        eventAt: order,
        isDone: 'ASC',
      },
      select: ['id', 'title', 'eventAt', 'alertOn', 'isDone'],
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
        'eventAt',
        'alertOn',
        'alarmAt',
        'isDone',
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
      eventAt: reminder.eventAt,
      alertOn: reminder.alertOn,
      alarmAt: reminder.alarmAt,
      isDone: reminder.isDone,
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
    reminder.eventAt = updateReminderDto.eventAt
      ? updateReminderDto.eventAt
      : reminder.eventAt;
    reminder.alertOn = updateReminderDto.alertOn
      ? updateReminderDto.alertOn
      : reminder.alertOn;
    reminder.alarmAt = updateReminderDto.alarmAt
      ? updateReminderDto.alarmAt
      : reminder.alarmAt;
    reminder.situation = updateReminderDto.situationId
      ? await this.situationRepository.findOne({
          where: {
            id: updateReminderDto.situationId,
          },
        })
      : reminder.situation;

    await this.reminderRepository.save(reminder);

    return {
      id: id,
      title: reminder.title,
      content: reminder.content,
      eventAt: reminder.eventAt,
      alertOn: reminder.alertOn,
      alarmAt: reminder.alarmAt,
      isDone: reminder.isDone,
      situation: reminder.situation.content,
    };
  }

  async delete(id: number, user: User) {
    await this.reminderRepository.softDelete(id);
    return {
      id: id,
      isDeleted: true,
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
      { isDone: true },
    );
    return {
      id: id,
      isDone: true,
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
      { isDone: false },
    );
    return {
      id: id,
      isDone: false,
    };
  }
}
