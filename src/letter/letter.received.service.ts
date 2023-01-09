import {
  BadRequestException,
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
import { LetterType, SendLetterStatus } from './letter.constants';
import { PaginationBuilder } from 'src/common/paginations/paginationBuilder.response';
import { TempLetterRepository } from './repository/tempLetter.repository';
import { ReceviedTempLetterResponseDto } from './dto/responses/receviedTempLetter.response.dto';
import { ReceviedAllResponseDto } from './dto/responses/letterStorage.response.dto';
import { ReceivedLetterDetailResponseDto } from './dto/responses/letterDetail.response.dto';
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

  async findAll(user: User, query: any): Promise<ReceivedLetter[]> {
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

    if (query.tags != undefined) {
      letter.andWhere('situationId IN (:situations)', {
        situations: query.tags,
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
    console.log(letter);
    if (!letter) {
      throw new BadRequestException('접근할 수 없는 편지입니다.');
    }

    return new ReceivedLetterDetailResponseDto(letter);
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

  async findOneTemp(id: number): Promise<ReceviedTempLetterResponseDto> {
    const isActive = this.tempLetterRepository.findById(id);

    if (!isActive) {
      throw new BadRequestException({
        message: 'Letter is Already Time Out or Deleted',
        error: 'Letter is Already Time Out or Deleted',
      });
    }

    const sendLetter = await this.sendLetterRepository.findOne({
      where: { id: id },
      relations: {
        receiver: true,
        letterBody: true,
        sender: true,
      },
    });

    if (!sendLetter || sendLetter.status == SendLetterStatus.SENT) {
      throw new NotFoundException({
        message: 'There is no id',
        error: 'Bad Request to this Id, There is no id',
      });
    }

    const result = new ReceviedTempLetterResponseDto();
    result.id = id;
    result.senderNickname = sendLetter.sender.nickname;
    result.receivedAt = sendLetter.createdAt;
    result.content = sendLetter.letterBody.content;
    result.situationId = sendLetter.letterBody.situationId;

    return result;
  }
}
