import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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
import { ReceviedAllResponseDto } from './dto/responses/letterStorage.response.dto';
import {
  ReceivedLetterDetailResponseDto,
  tempLetterResponseDto,
} from './dto/responses/letterDetail.response.dto';
import { SendLetter } from './entities/sendLetter.entity';

@Injectable()
export class LetterReceivedService {
  constructor(
    @InjectRepository(ReceivedLetter)
    private receivedLetterRepository: Repository<ReceivedLetter>,
    private tempLetterRepository: TempLetterRepository,
    @InjectRepository(SendLetter)
    private sendLetterRepository: Repository<SendLetter>,
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

  async findAll(user: User, query: any): Promise<ReceviedAllResponseDto[]> {
    const order = query.order === 'ASC' ? 'ASC' : 'DESC';

    const letter = this.receivedLetterRepository
      .createQueryBuilder('receivedLetter')
      .leftJoinAndSelect('receivedLetter.letterBody', 'letterBody')
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

    if (query.situations != undefined) {
      letter.andWhere('situationId IN (:situations)', {
        situations: query.situations,
      });
    }

    const [dataList, count] = await letter

      .skip(query.getSkip())
      .take(query.getTake())
      .orderBy('receivedLetter.receivedAt', order)
      .getManyAndCount();
    console.log(dataList);
    const data = dataList.map((element) => {
      return new ReceviedAllResponseDto(element);
    });
    return new PaginationBuilder()
      .setData(data)
      .setTotalCount(count)
      .setPage(query.getPage())
      .setTake(query.getTake())
      .build();
  }

  async findOne(
    user: User,
    id: number,
  ): Promise<ReceivedLetterDetailResponseDto> {
    const letter = await this.receivedLetterRepository.findOne({
      where: { id: id, receiver: { id: user.id } },
      relations: ['letterBody'],
    });
    if (!letter) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'This Letter is not available',
        error:
          "Bad Request to this Letter Id OR You don't have access to this letter.",
      });
    }

    return new ReceivedLetterDetailResponseDto(letter);
  }

  async delete(id: number): Promise<void> {
    const result = await this.receivedLetterRepository.softDelete(id);
    if (result.affected === 0) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'This Letter is not available',
        error:
          "Bad Request to this Letter Id OR You don't have access to this letter.",
      });
    }
  }

  async uploadExternalLetterImage(file: Express.MulterS3.File): Promise<any> {
    if (!file) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'There is no image file',
        error: 'Image file is not uploaded',
      });
    }
    return {
      filePath: file.location,
    };
  }

  async findOneTemp(id: number) {
    const isActive = this.tempLetterRepository.findById(id);

    if (!isActive) {
      throw new BadRequestException({
        message: 'Letter is Already Time Out or Deleted',
        error:
          'Your letter access time has expired and you can no longer read it',
        statusCode: 400,
      });
    }

    //TODO: Redis로 테스트 해봐야함
    // const sendLetter = await this.sendLetterRepository.findOne({
    //   where: { id: id },
    //   relations: { letterBody: true, sender: true },
    // });

    // const tempLetter = new tempLetterResponseDto(sendLetter);
    // console.log(tempLetter);
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
