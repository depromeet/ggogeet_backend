import { PartialType } from '@nestjs/swagger';
import { CreateReminderDto } from './createReminder.dto';

export class UpdateReminderDto extends PartialType(CreateReminderDto) {}
