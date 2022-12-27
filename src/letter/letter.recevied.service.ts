import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ReceivedLetter } from './entities/receivedLetter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateExternalImgLetterDto } from './dto/requests/createExternalLetterImg.request.dto';
import { CreateExternalTextLetterDto } from './dto/requests/createExternalLetter.request.dto';
import { LetterBody } from './entities/letterBody.entity';
import { LetterType } from './letter.constants';

@Injectable()
export class LetterReceviedService {
  constructor(
    @InjectRepository(ReceivedLetter)
    private receviedLetterRepository: Repository<ReceivedLetter>,
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
    letterBody.templateUrl = createExternalTextLetter.templateUrl;

    const receivedLetter = new ReceivedLetter();
    receivedLetter.receiver = user;
    receivedLetter.letterBody = letterBody;
    receivedLetter.senderNickname = createExternalTextLetter.senderNickname;

    const result = await this.receviedLetterRepository.save(receivedLetter);
    return result;
  }

  async createImageLetter(
    user: User,
    createExternalImgLetterDto: CreateExternalImgLetterDto,
  ) {}

  async findAll(user: User, query: any): Promise<ReceivedLetter[]> {
    const letters = this.receviedLetterRepository.find({
      where: {
        receiver: { id: user.id },
      },
      relations: ['letterBody'],
    });

    return letters;
  }

  async findOne(user: User, id: number): Promise<ReceivedLetter> {
    const letter = await this.receviedLetterRepository.findOne({
      where: { id: id, receiver: { id: user.id } },
      relations: ['letterBody'],
    });
    if (!letter) {
      throw new BadRequestException('There is no id');
    }
    return letter;
  }

  async delete(id: number): Promise<void> {
    const result = await this.receviedLetterRepository.softDelete(id);
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
}
