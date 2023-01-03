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
import { CreateReminderDto } from './dto/requests/createReminder.request.dto';
import { UpdateReminderDto } from './dto/requests/updateReminder.request.dto';
import { ReminderService } from './reminder.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ReminderResponseDto } from './dto/responses/reminder.response.dto';
import { ReminderStautsResponseDto } from './dto/responses/reminderStatus.response.dto';

@Controller('reminders')
@ApiTags('Reminder API')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@ApiNotFoundResponse({
  description: '리마인더가 존재하지 않습니다.',
})
@ApiForbiddenResponse({
  description: '리마인더를 수정 또는 생성, 조회할 권한이 없습니다.',
})
export class ReminderController {
  constructor(private readonly reminderService: ReminderService) {}

  @ApiOperation({
    summary: '리마인더 목록 조회 API',
    description: '유저의 리마인더 목록을 조회합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '리마인더 목록을 반환합니다.',
    type: [CreateReminderDto],
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
    description: '유저 리마인더를 상세내용을 조회합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '리마인더 상세내용을 반환합니다.',
    type: ReminderResponseDto,
  })
  @Get(':id')
  findOne(@Param('id') id: number, @ReqUser() user: User) {
    return this.reminderService.findOne(id, user);
  }

  @ApiOperation({
    summary: '리마인더 생성 API',
    description: '리마인더를 생성합니다.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '리마인더 생성 성공',
    type: ReminderResponseDto,
  })
  @ApiBody({
    type: CreateReminderDto,
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: '리마인더 수정 성공후 상세내용을 반환합니다.',
    type: ReminderResponseDto,
  })
  @ApiBody({
    type: UpdateReminderDto,
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
  @ApiResponse({
    status: HttpStatus.OK,
    description: '리마인더 완료 상태변경 성공',
    type: ReminderStautsResponseDto,
  })
  @Patch('done/:id')
  done(@Param('id') id: number, @ReqUser() user: User) {
    return this.reminderService.done(id, user);
  }

  @ApiOperation({
    summary: '리마인더 미완료 API',
    description: '리마인더의 상태를 미완료로 변경합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '리마인더 미완료 상태변경 성공',
    type: ReminderStautsResponseDto,
  })
  @Patch('undone/:id')
  undone(@Param('id') id: number, @ReqUser() user: User) {
    return this.reminderService.undone(id, user);
  }

  @ApiOperation({
    summary: '리마인더 삭제 API',
    description: '리마인더를 삭제합니다.',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '리마인더 삭제 성공',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(@Param('id') id: number, @ReqUser() user: User) {
    return this.reminderService.delete(id, user);
  }
}
