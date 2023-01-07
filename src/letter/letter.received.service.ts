import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ReceivedLetter } from './entities/receivedLetter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateExternalImgLetterDto } from './dto/requests/createExternalLetterImg.request.dto';
import { CreateExternalTextLetterDto } from './dto/requests/createExternalLetter.request.dto';
import { LetterBody } from './entities/letterBody.entity';
import { LetterType } from './letter.constants';
import { PaginationBuilder } from 'src/common/paginations/paginationBuilder.response';
import { TempLetterRepository } from './repository/tempLetter.repository';
import { ReceviedTempLetterResponseDto } from './dto/responses/receviedTempLetter.response.dto';

@Injectable()
export class LetterReceivedService {
  constructor(
    @InjectRepository(ReceivedLetter)
    private receivedLetterRepository: Repository<ReceivedLetter>,
  ) {}

  async createTextLetter(
    user: User,
    createExternalTextLetter: CreateExternalTextLetterDto,
  ) {
    const letterBody = new LetterBody();
    letterBody.title = createExternalTextLetter.title;
    letterBody.content = createExternalTextLetter.content;
    letterBody.type = LetterType.EXTERNAL;
    letterBody.situationId = createExternalTextLetter.situationId;

    const receivedLetter = new ReceivedLetter();
    receivedLetter.receiver = user;
    receivedLetter.letterBody = letterBody;
    receivedLetter.senderNickname = createExternalTextLetter.senderNickname;

    const result = await this.receivedLetterRepository.save(receivedLetter);
    return result;
  }

  async createImageLetter(
    user: User,
    createExternalImgLetterDto: CreateExternalImgLetterDto,
  ) {
    const letterBody = new LetterBody();
    letterBody.title = createExternalImgLetterDto.title;
    letterBody.imageContent = createExternalImgLetterDto.imageUrl;
    letterBody.type = LetterType.EXTERNALIMG;
    letterBody.situationId = createExternalImgLetterDto.situationId;

    const receivedLetter = new ReceivedLetter();
    receivedLetter.receiver = user;
    receivedLetter.letterBody = letterBody;
    receivedLetter.senderNickname = createExternalImgLetterDto.senderNickname;

    const result = await this.receivedLetterRepository.save(receivedLetter);
    return result;
  }

  async findAll(user: User, query: any): Promise<ReceivedLetter[]> {
    const order = query.order === 'ASC' ? 'ASC' : 'DESC';

    const letter = this.receivedLetterRepository
      .createQueryBuilder('receivedLetter')
      .where('receiverId = :id', { id: user.id });

    if (query.startDate !== undefined && query.endDate !== undefined) {
      letter.andWhere('receivedAt BETWEEN :startDate AND :endDate', {
        startDate: query.startDate,
        endDate: query.endDate,
      });
    }

    if (query.receivers !== undefined) {
      letter.andWhere('receiverId IN (:receivers)', {
        receivers: query.receivers,
      });
    }

    if (query.tags != undefined) {
      letter.andWhere('tagId IN (:tags)', { tags: query.tags });
    }

    const [data, count] = await letter
      .leftJoinAndSelect('receivedLetter.letterBody', 'letterBody')
      .select(['receviedLetter.id', 'receviedLetter.sendAt'])
      .skip(query.getSkip())
      .take(query.getTake())
      .orderBy('receivedAt', order)
      .getManyAndCount();

    return new PaginationBuilder()
      .setData(data)
      .setTotalCount(count)
      .setPage(query.getPage())
      .setTake(query.getTake())
      .build();
  }

  async findOne(user: User, id: number): Promise<ReceivedLetter> {
    const letter = await this.receivedLetterRepository.findOne({
      where: { id: id, receiver: { id: user.id } },
      relations: ['letterBody'],
    });
    if (!letter) {
      throw new BadRequestException('There is no id');
    }
    return letter;
  }

  async delete(id: number): Promise<void> {
    const result = await this.receivedLetterRepository.softDelete(id);
    if (result.affected === 0) {
      throw new BadRequestException('There is no id');
    }
  }

  async uploadExternalLetterImage(file: Express.MulterS3.File): Promise<any> {
    if (!file) {
      throw new BadRequestException('There is no file');
    }
    return {
      filePath: file.location,
    };
  }

  async findOneTemp(id: number) {
    const tempLetterRepository = new TempLetterRepository();
    const isActive = tempLetterRepository.findById(id);

    if (!isActive) {
      throw new BadRequestException({
        message: 'Letter is Already Time Out or Deleted',
        statusCode: 400,
      });
    }

    const result = new ReceviedTempLetterResponseDto();
    result.id = 1;
    result.title = 'test';
    result.content = 'test';
    result.sender = 'test';
    result.receiver = 'test';
    result.createdAt = new Date();

    return result;
  }
}
