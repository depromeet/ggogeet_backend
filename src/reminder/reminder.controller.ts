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
  findAll(@Query('limit') limit: number, @Query('offset') offset: number) {
    return this.reminderService.findAll();
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

  @Patch(':id/done')
  done(@Param('id') id: number) {
    return this.reminderService.done(id);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.reminderService.delete(id);
  }
}
