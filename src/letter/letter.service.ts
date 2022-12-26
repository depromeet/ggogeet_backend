import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { ReceivedLetter } from './entities/receivedLetter.entity';
import { SendLetter } from './entities/sendLetter.entity';
import { LetterType, SendLetterStatus } from './letter.constants';
import { CreateDraftLetterDto } from './dto/requests/createDraftLetter.request.dto';

@Injectable()
export class LetterService {
  constructor(
    @InjectRepository(ReceivedLetter)
    private letterRepository: Repository<ReceivedLetter>,
    @InjectRepository(SendLetter)
    private sendLetterRepository: Repository<SendLetter>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ReceivedLetter)
    private receivedLetterRepository: Repository<ReceivedLetter>,
  ) {}

  async createDraftLetter(
    user: User,
    createNewLetterDto: CreateDraftLetterDto,
  ) {
    // todo : Create User Draft Letter
  }

  async sendLetter(user: User, id: number) {
    // todo : Send Letter
  }

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

  async delete(id: number): Promise<UpdateResult> {
    return await this.letterRepository.update(id, { deletedAt: new Date() });
  }

  uploadExternalLetterImage(file: Express.MulterS3.File) {
    if (!file) {
      throw new BadRequestException('There is no file');
    }
    return {
      filePath: file.location,
    };
  }

  async getSendLetters(
    userId: number,
    page = 1,
    take = 10,
  ): Promise<{
    meta: {
      page: number;
      take: number;
      totalCount: number;
      totalPage: number;
      hasNext: boolean;
    };
    data: { sendLetters: SendLetter[] };
  }> {
    const [results, totalCount] = await this.sendLetterRepository.findAndCount({
      relations: {
        letterBody: true,
      },
      where: {
        sender: { id: userId },
      },
      take: take,
      skip: take * (page - 1),
      order: { createdAt: -1 },
    });

    return {
      meta: {
        page,
        take,
        totalCount,
        totalPage: Math.ceil(totalCount / take), // #TODO
        hasNext: totalCount > (page - 1) * take, // #TODO
      },
      data: {
        sendLetters: results,
      },
    };
  }
}
