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
import { CreateNoticeDto } from './dto/create-notice.dto';
import { UpdateNoticeDto } from './dto/update-notice.dto';
import { NoticeService } from './notice.service';

@Controller('notices')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get()
  findAll() {
    // todo: add sorting, pagination
    return this.noticeService.findAll();
  }

  @Get('/:id')
  findOne(@Param('id') id: number) {
    return this.noticeService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() noticeData: CreateNoticeDto) {
    // todo: add validation
    return this.noticeService.create(noticeData);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() noticeDto: UpdateNoticeDto) {
    // todo: add validation
    return this.noticeService.update(id, noticeDto);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    // todo: add validation
    return this.noticeService.delete(id);
  }
}
