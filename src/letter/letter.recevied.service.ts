import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository, UpdateResult } from 'typeorm';
import { ReceivedLetter } from './entities/receivedLetter.entity';
import { LetterType } from './letter.constants';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class LetterReceviedService {
  constructor(
    @InjectRepository(ReceivedLetter)
    private letterRepository: Repository<ReceivedLetter>,
  ) {}

  findAll(query): Promise<ReceivedLetter[]> {
    const limit = query.limit ? query.limit : 10;
    const offset = query.offset ? query.offset : 0;
    const order = query.order ? query.order : 'DESC';
    const fromDate = query.fromDate
      ? new Date(query.fromDate)
      : new Date('1970-01-01');
    const toDate = query.toDate ? new Date(query.toDate) : new Date();
    const letterTypes = query.type
      ? query.type
      : [LetterType.EXTERNAL, LetterType.EXTERNALIMG];

    const letters = this.letterRepository
      .createQueryBuilder('letter')
      .select(['letter.id', 'letter.senderNickname', 'letter.receivedAt'])
      .andWhere('letter.userId = :userId', { userId: 1 })
      .andWhere('letter.deletedAt IS NULL')
      .andWhere('letter.receivedAt >= :fromDate', {
        fromDate: fromDate,
      })
      .andWhere('letter.receivedAt < :toDate', {
        toDate: toDate,
      })
      .addOrderBy('letter.receivedAt', order)
      .limit(limit)
      .offset(offset)
      .getMany();

    return letters;
  }

  async findOne(id: number): Promise<ReceivedLetter> {
    const letter = await this.letterRepository.findOne({
      where: { id: id },
      select: ['id', 'senderNickname', 'receivedAt'],
    });
    if (!letter) {
      throw new BadRequestException('There is no id');
    }
    return letter;
  }

  async delete(id: number): Promise<void> {
    await this.letterRepository.update(id, { deletedAt: new Date() });
  }

  async uploadExternalLetterImage(file: Express.MulterS3.File): Promise<any> {
    if (!file) {
      throw new BadRequestException('There is no file');
    }
    return {
      filePath: file.location,
    };
  }
}
