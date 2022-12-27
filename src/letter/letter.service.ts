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
    @InjectRepository(SendLetter)
    private sendLetterRepository: Repository<SendLetter>,
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
