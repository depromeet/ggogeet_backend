import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async createReminder(reminderDto: CreateReminderDto) {
    const user = await this.userRepository.findOne({ where: { id: 1 } });
    console.log(reminderDto);
    const reminder = new Reminder();
    reminder.title = reminderDto.title;
    reminder.content = reminderDto.content;
    reminder.event_at = reminderDto.event_at;
    reminder.alert_on = reminderDto.alert_on;
    reminder.alarm_at = reminderDto.alarm_at;
    reminder.is_done = false;
    reminder.user = user;
    return this.reminderRepository.save(reminder);
  }

  async findAll() {
    return this.reminderRepository.findAndCount({
      where: {
        deleted_at: null,
      },
    });
  }

  async findOne(id: number) {
    return this.reminderRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async update(id: number, updateReminderDto: UpdateReminderDto) {
    const reminder = await this.reminderRepository.findOne({
      where: {
        id: id,
      },
    });
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
    return this.reminderRepository.save(reminder);
  }

  async delete(id: number) {
    return `This action removes a #${id} reminder`;
  }

  async done(id: number) {
    return await this.reminderRepository.update(id, { is_done: true });
  }
}
