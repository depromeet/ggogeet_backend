import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateExternalImgLetterDto } from './dto/create-external-letter-img.dto';
import { CreateExternalLetterDto } from './dto/create-external-letter.dto';
import { LetterInfo } from './entities/letterinfo.entity';
import { ReceiveLetter } from './entities/recevieletter.entity';
import { LetterType } from './letter.constants';

@Injectable()
export class LetterService {
  constructor(
    @InjectRepository(ReceiveLetter)
    private letterRepository: Repository<ReceiveLetter>,

    @InjectRepository(LetterInfo)
    private letterInfoRepository: Repository<LetterInfo>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  findAll(query): Promise<ReceiveLetter[]> {
    const limit = query.limit ? query.limit : 10;
    const offset = query.offset ? query.offset : 0;
    const order = query.order ? query.order : 'DESC';
    const from_date = query.from_date
      ? new Date(query.from_date)
      : new Date('1970-01-01');
    const to_date = query.to_date ? new Date(query.to_date) : new Date();
    const letter_types = query.type
      ? query.type
      : [LetterType.EXTERNAL, LetterType.EXTERNALIMG];

    const letters = this.letterRepository
      .createQueryBuilder('letter')
      .select(['letter.id', 'letter.sender_nickname', 'letter.received_at'])
      .leftJoin('letter.letterinfo', 'letterinfo')
      .addSelect(['letterinfo.template_url'])
      .andWhere('letter.user_id = :user_id', { user_id: 1 })
      .andWhere('letter.deleted_at IS NULL')
      .andWhere('letter.received_at >= :from_date', {
        from_date: from_date,
      })
      .andWhere('letter.received_at < :to_date', {
        to_date: to_date,
      })
      .andWhere('letterinfo.type IN (:...types)', { types: letter_types })
      .addOrderBy('letter.received_at', order)
      .limit(limit)
      .offset(offset)
      .getMany();

    return letters;
  }

  async findOne(id: number): Promise<ReceiveLetter> {
    const letter = await this.letterRepository.findOne({
      where: { id: id },
      select: ['id', 'sender_nickname', 'received_at'],
      relations: {
        letterinfo: true,
      },
    });
    if (!letter) {
      throw new BadRequestException('There is no id');
    }
    return letter;
  }

  async createExternalLetter(
    createExternalLetterDto: CreateExternalLetterDto,
  ): Promise<ReceiveLetter> {
    const letterInfo = new LetterInfo();
    letterInfo.type = LetterType.EXTERNAL;
    letterInfo.content = createExternalLetterDto.content;
    await this.letterInfoRepository.save(letterInfo);

    const letter = new ReceiveLetter();
    letter.letterinfo = letterInfo;
    letter.received_at = new Date(createExternalLetterDto.date);
    letter.sender_nickname = createExternalLetterDto.sender;

    const user = await this.userRepository.findOne({ where: { id: 1 } });
    if (!user) {
      throw new BadRequestException('There is no user');
    }
    letter.user = user;

    return await this.letterRepository.save(letter);
  }

  async createExternalImgLetter(
    createExternalImgLetterDto: CreateExternalImgLetterDto,
  ): Promise<ReceiveLetter> {
    const letterInfo = new LetterInfo();
    letterInfo.type = LetterType.EXTERNALIMG;
    letterInfo.image_url = createExternalImgLetterDto.image;
    await this.letterInfoRepository.save(letterInfo);

    const letter = new ReceiveLetter();
    letter.letterinfo = letterInfo;
    letter.received_at = new Date(createExternalImgLetterDto.date);
    letter.sender_nickname = createExternalImgLetterDto.sender;

    const user = await this.userRepository.findOne({ where: { id: 1 } });
    if (!user) {
      throw new BadRequestException('There is no user');
    }
    letter.user = user;

    return await this.letterRepository.save(letter);
  }

  async delete(id: number): Promise<UpdateResult> {
    return await this.letterRepository.update(id, { deleted_at: new Date() });
  }

  uploadExternalLetterImage(file: Express.MulterS3.File) {
    if (!file) {
      throw new BadRequestException('There is no file');
    }
    return {
      filePath: file.location,
    };
  }
}