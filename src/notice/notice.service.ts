import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateNoticeDto } from './dto/createNotice.dto';
import { DeleteNoticeDto } from './dto/deleteNotice.dto';
import { UpdateNoticeDto } from './dto/updateNotice.dto';
import { Notice } from './entities/notice.entity';
import { PaginationRequest } from 'src/common/paginations/pagination.request';
import { PaginationResponse } from 'src/common/paginations/pagination.response';
import { PaginationBuilder } from 'src/common/paginations/paginationBuilder.response';

@Injectable()
export class NoticeService {
  constructor(
    @InjectRepository(Notice)
    private noticeRepository: Repository<Notice>,
  ) {}

  async findAll(
    pagenation: PaginationRequest,
  ): Promise<PaginationResponse<Notice>> {
    const [data, count] = await this.noticeRepository.findAndCount({
      skip: pagenation.getSkip(),
      take: pagenation.getTake(),
    });

    return new PaginationBuilder()
      .setData(data)
      .setPage(pagenation.page)
      .setTake(pagenation.take)
      .setTotalCount(count)
      .build();
  }

  async findOne(id: number): Promise<Notice> {
    const notice = await this.noticeRepository.findOneBy({ id });
    if (!notice) {
      throw new NotFoundException(`Notice #${id} not found`);
    }
    return notice;
  }

  async create(noticeData: CreateNoticeDto): Promise<Notice> {
    const notice = new Notice();
    notice.title = noticeData.title;
    notice.content = noticeData.content;
    return await this.noticeRepository.save(notice);
  }

  async update(id: number, noticeData: UpdateNoticeDto): Promise<Notice> {
    const notice = await this.noticeRepository.findOneBy({ id });

    if (!notice) {
      throw new NotFoundException(`Notice #${id} not found`);
    }

    notice.title = noticeData.title;
    notice.content = noticeData.content;

    return await this.noticeRepository.save(notice);
  }

  async delete(id: number): Promise<DeleteNoticeDto> {
    const notice = await this.noticeRepository.findOneBy({ id });

    if (!notice) {
      throw new NotFoundException(`Notice #${id} not found`);
    }

    await this.noticeRepository.delete(id);
    const result = new DeleteNoticeDto();
    result.status = 'success';
    result.msg = `Sentence #${id} deleted`;
    return result;
  }
}
