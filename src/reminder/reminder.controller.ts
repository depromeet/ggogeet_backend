import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateReminderDto } from './dto/create-reminder.dto';
import { UpdateReminderDto } from './dto/update-reminder.dto';
import { ReminderService } from './reminder.service';

@Controller('reminders')
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @Get()
  findAll(
    @Query()
    query: {
      offset: number;
      limit: number;
      done: boolean;
    },
  ) {
    return this.reminderService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.reminderService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() reminderDto: CreateReminderDto) {
    return this.reminderService.createReminder(reminderDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() reminderDto: UpdateReminderDto) {
    return this.reminderService.update(id, reminderDto);
  }

  @Patch('done/:id')
  done(@Param('id') id: number) {
    return this.reminderService.done(id);
  }

  @Patch('undone/:id')
  undone(@Param('id') id: number) {
    return this.reminderService.undone(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.reminderService.delete(id);
  }
}
