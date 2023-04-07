import { PartialType } from '@nestjs/swagger';
import { CreateReminderDto } from './createReminder.request.dto';

export class UpdateReminderDto extends PartialType(CreateReminderDto) {}
