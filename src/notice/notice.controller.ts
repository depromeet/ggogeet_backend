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
} from '@nestjs/common';
import { CreateNoticeDto } from './dto/createNotice.dto';
import { UpdateNoticeDto } from './dto/updateNotice.dto';
import { NoticeService } from './notice.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('notices')
@ApiTags('Notice API')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @ApiOperation({
    summary: '모든 공지사항 가져오기 API',
    description: '모든 공지사항을 가져옵니다.',
  })
  @Get()
  findAll() {
    // todo: add sorting, pagination
    return this.noticeService.findAll();
  }

  @ApiOperation({
    summary: '공지사항 상세정보 가져오기 API',
    description: '공지사항을 상세정보를 가져옵니다.',
  })
  @Get('/:id')
  findOne(@Param('id') id: number) {
    return this.noticeService.findOne(id);
  }

  @ApiOperation({
    summary: '공지사항 추가하기 API',
    description: '공지사항을 추가합니다.',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() noticeData: CreateNoticeDto) {
    // todo: add validation
    return this.noticeService.create(noticeData);
  }

  @ApiOperation({
    summary: '공지사항 수정하기 API',
    description: '공지사항을 수정합니다.',
  })
  @Patch(':id')
  update(@Param('id') id: number, @Body() noticeDto: UpdateNoticeDto) {
    // todo: add validation
    return this.noticeService.update(id, noticeDto);
  }

  @ApiOperation({
    summary: '공지사항 삭제하기 API',
    description: '공지사항을 삭제합니다.',
  })
  @Delete(':id')
  delete(@Param('id') id: number) {
    // todo: add validation
    return this.noticeService.delete(id);
  }
}
