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
import { GetPagination } from 'src/common/decorators/pagination.decorators';
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
  findAll(@GetPagination() pagenation: PaginationRequest) {
    return this.noticeService.findAll(pagenation);
  }

  @ApiOperation({
    summary: '공지사항 상세정보 가져오기 API',
    description: '공지사항을 상세정보를 가져옵니다.',
  })
  @Get('/:id')
  async findOne(@Param('id') id: number) {
    const notice = await this.noticeService.findOne(id);
    return { data: notice };
  }

  @ApiOperation({
    summary: '공지사항 추가하기 API',
    description: '공지사항을 추가합니다.',
  })
  @ApiBearerAuth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() noticeData: CreateNoticeDto) {
    // todo: add validation
    const notice = await this.noticeService.create(noticeData);
    return { data: notice };
  }

  @ApiOperation({
    summary: '공지사항 수정하기 API',
    description: '공지사항을 수정합니다.',
  })
  @ApiBearerAuth()
  @Patch(':id')
  async update(@Param('id') id: number, @Body() noticeDto: UpdateNoticeDto) {
    // todo: add validation
    const notice = await this.noticeService.update(id, noticeDto);
    return { data: notice };
  }

  @ApiOperation({
    summary: '공지사항 삭제하기 API',
    description: '공지사항을 삭제합니다.',
  })
  @ApiBearerAuth()
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: number) {
    // todo: add validation
    return this.noticeService.delete(id);
  }
}
