import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Reminder } from './entities/reminder.entity';
import { ReminderController } from './reminder.controller';
import { ReminderService } from './reminder.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reminder, User])],
  controllers: [ReminderController],
  providers: [ReminderService],
})
export class ReminderModule {}
