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
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('reminders')
@ApiTags('Reminder API')
@UseGuards(JwtAuthGuard)
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @ApiOperation({
    summary: '리마인더 목록 조회 API',
    description: '리마인더 목록을 조회합니다.',
  })
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

  @ApiOperation({
    summary: '리마인더 상세 조회 API',
    description: '리마인더를 상세내용을 조회합니다.',
  })
  @Get(':id')
  findOne(@Param('id') id: number, @ReqUser() user: User) {
    return this.reminderService.findOne(id, user);
  }

  @ApiOperation({
    summary: '리마인더 생성 API',
    description: '리마인더를 생성합니다.',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() reminderDto: CreateReminderDto, @ReqUser() user: User) {
    return this.reminderService.createReminder(reminderDto, user);
  }

  @ApiOperation({
    summary: '리마인더 수정 API',
    description: '리마인더를 수정합니다.',
  })
  @Patch(':id')
  update(
    @Param('id') id: number,
    @Body() reminderDto: UpdateReminderDto,
    @ReqUser() user: User,
  ) {
    return this.reminderService.update(id, reminderDto, user);
  }

  @ApiOperation({
    summary: '리마인더 완료 API',
    description: '리마인더의 상태를 완료로 변경합니다.',
  })
  @Patch('done/:id')
  done(@Param('id') id: number, @ReqUser() user: User) {
    return this.reminderService.done(id, user);
  }

  @ApiOperation({
    summary: '리마인더 미완료 API',
    description: '리마인더의 상태를 미완료로 변경합니다.',
  })
  @Patch('undone/:id')
  undone(@Param('id') id: number, @ReqUser() user: User) {
    return this.reminderService.undone(id, user);
  }

  @ApiOperation({
    summary: '리마인더 삭제 API',
    description: '리마인더를 삭제합니다.',
  })
  @Delete(':id')
  delete(@Param('id') id: number, @ReqUser() user: User) {
    return this.reminderService.delete(id, user);
  }
}
