import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { ManyToMany, Repository, UpdateResult } from 'typeorm';
import { CreateExternalImgLetterDto } from './dto/requests/createExternalLetterImg.request.dto';
import { CreateExternalLetterDto } from './dto/requests/createExternalLetter.request.dto';
import { CreateSendLetterDto } from './dto/requests/createSendLetter.request.dto';
import { LetterBody } from './entities/letterBody.entity';
import { ReceivedLetter } from './entities/receivedLetter.entity';
import { SendLetter } from './entities/sendLetter.entity';
import { LetterType, SendLetterStatus } from './letter.constants';

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

  // async createExternalLetter(
  //   createExternalLetterDto: CreateExternalLetterDto,
  // ): Promise<ReceivedLetter> {
  //   const letter = new ReceivedLetter();
  //   letter.receivedAt = new Date(createExternalLetterDto.date);
  //   letter.senderNickname = createExternalLetterDto.sender;

  //   const user = await this.userRepository.findOne({ where: { id: 1 } });
  //   if (!user) {
  //     throw new BadRequestException('There is no user');
  //   }
  //   letter.user = user;

  //   return await this.letterRepository.save(letter);
  // }

  // async createExternalImgLetter(
  //   createExternalImgLetterDto: CreateExternalImgLetterDto,
  // ): Promise<ReceivedLetter> {
  //   const letter = new ReceivedLetter();
  //   letter.receivedAt = new Date(createExternalImgLetterDto.date);
  //   letter.senderNickname = createExternalImgLetterDto.sender;

  //   const user = await this.userRepository.findOne({ where: { id: 1 } });
  //   if (!user) {
  //     throw new BadRequestException('There is no user');
  //   }
  //   letter.user = user;

  //   return await this.letterRepository.save(letter);
  // }

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

  async createSendLetter(
    createSendLetterDto: CreateSendLetterDto,
  ): Promise<SendLetter> {
    const sender = await this.userRepository.findOne({
      where: { id: createSendLetterDto.userId },
    });
    const receiver = createSendLetterDto?.receiverId ? 
      await this.userRepository.findOne({
        where: { id: createSendLetterDto.receiverId },
      }) : null;

    const letterBody = new LetterBody();
    letterBody.title = createSendLetterDto.title;
    letterBody.content = createSendLetterDto.content;
    letterBody.templateUrl = createSendLetterDto.templateUrl;
    letterBody.accessCode = 'should_generate_random_code'; // #TODO
    letterBody.situationId = createSendLetterDto.situationId;

    const sendLetter = new SendLetter();
    sendLetter.sender = sender;
    if (createSendLetterDto.receiverId) sendLetter.receiver = receiver;
    sendLetter.receiverNickname = createSendLetterDto.receiverNickname;
    sendLetter.status = SendLetterStatus.SENT;
    sendLetter.letterBody = letterBody;

    const newSendLetter = await this.sendLetterRepository.save(sendLetter);

    // receivedLetter 생성하기.
    if (createSendLetterDto.receiverId) {
      const receivedLetter = new ReceivedLetter();
      receivedLetter.sender = sender;
      receivedLetter.receiver = receiver;
      receivedLetter.senderNickname = sender.nickname;

      await this.receivedLetterRepository.save(receivedLetter);
    }

    return newSendLetter;
  }
  
  async getSendLetters(
    userId: number,
    page: number = 1,
    take: number = 10,
  ): Promise<{
    meta: {
      page : number,
	    take: number,
	    totalCount: number,
	    totalPage: number,
	    hasNext:boolean
    },
    sendLetters: SendLetter[]
  }> {
    const [results, totalCount] = await this.sendLetterRepository.findAndCount({
      relations: {
        letterBody: true
      },
      where: { 
        sender: {id: userId} 
      },
      take: take,
      skip: take * (page -1),
      order: { createdAt: -1 }
    });

    return {
      meta: {
        page,
        take,
        totalCount,
        totalPage: Math.ceil(totalCount / take), // #TODO
        hasNext: totalCount > (page -1) * take // #TODO
      }, 
      sendLetters: results
    };
  }
}
