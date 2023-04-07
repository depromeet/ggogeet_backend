import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { User } from 'src/domain/users/entities/user.entity';
import { Reminder } from './entities/reminder.entity';
import { ReminderController } from './reminder.controller';
import { ReminderService } from './reminder.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reminder, User]),
    PassportModule,
    AuthModule,
  ],
  controllers: [ReminderController],
  providers: [ReminderService, JwtStrategy],
})
export class ReminderModule {}
