import { PartialType } from '@nestjs/mapped-types';
import { CreateReminderDto } from './createReminder.dto';

export class UpdateReminderDto extends PartialType(CreateReminderDto) {}
