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
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { GetPagenation } from 'src/common/decorators/pagination.decorators';
import {
  ApiPaginationRequst,
  ApiPaginationResponse,
} from 'src/common/paginations/pagination.swagger';
import { Notice } from './entities/notice.entity';
import { PaginationRequest } from 'src/common/paginations/pagination.request';

@Controller('notices')
@ApiTags('Notice API')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @ApiOperation({
    summary: '모든 공지사항 가져오기 API',
    description: '모든 공지사항을 가져옵니다.',
  })
  @ApiPaginationRequst()
  @ApiPaginationResponse(Notice)
  @Get()
  findAll(@GetPagenation() pagenation: PaginationRequest) {
    return this.noticeService.findAll(pagenation);
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
  @ApiBearerAuth()
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
  @ApiBearerAuth()
  @Patch(':id')
  update(@Param('id') id: number, @Body() noticeDto: UpdateNoticeDto) {
    // todo: add validation
    return this.noticeService.update(id, noticeDto);
  }

  @ApiOperation({
    summary: '공지사항 삭제하기 API',
    description: '공지사항을 삭제합니다.',
  })
  @ApiBearerAuth()
  @Delete(':id')
  delete(@Param('id') id: number) {
    // todo: add validation
    return this.noticeService.delete(id);
  }
}
