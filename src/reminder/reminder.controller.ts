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
  UseGuards,
} from '@nestjs/common';
import { ReqUser } from 'src/common/decorators/user.decorators';
import { JwtAuthGuard } from 'src/common/guards/jwtAuth.guard';
import { User } from 'src/users/entities/user.entity';
import { CreateReminderDto } from './dto/createReminder.dto';
import { UpdateReminderDto } from './dto/updateReminder.dto';
import { ReminderService } from './reminder.service';

@Controller('reminders')
@UseGuards(JwtAuthGuard)
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
    @ReqUser() user: User,
  ) {
    return this.reminderService.findAll(query, user);
  }

  @Get(':id')
  findOne(@Param('id') id: number, @ReqUser() user: User) {
    return this.reminderService.findOne(id, user);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() reminderDto: CreateReminderDto, @ReqUser() user: User) {
    return this.reminderService.createReminder(reminderDto, user);
  }

  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() reminderDto: UpdateReminderDto,
    @ReqUser() user: User,
  ) {
    return this.reminderService.update(id, reminderDto, user);
  }

  @Patch('done/:id')
  done(@Param('id') id: number, @ReqUser() user: User) {
    return this.reminderService.done(id, user);
  }

  @Patch('undone/:id')
  undone(@Param('id') id: number, @ReqUser() user: User) {
    return this.reminderService.undone(id, user);
  }

  @Delete(':id')
  delete(@Param('id') id: number, @ReqUser() user: User) {
    return this.reminderService.delete(id, user);
  }
}
