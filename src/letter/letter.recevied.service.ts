import { BadRequestException, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { ReceivedLetter } from './entities/receivedLetter.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { CreateExternalImgLetterDto } from './dto/requests/createExternalLetterImg.request.dto';
import { CreateExternalTextLetterDto } from './dto/requests/createExternalLetter.request.dto';

@Injectable()
export class LetterReceviedService {
  constructor(
    @InjectRepository(ReceivedLetter)
    private receviedLetterRepository: Repository<ReceivedLetter>,
  ) {}

  async createTextLetter(
    user: User,
    createExternalTextLetter: CreateExternalTextLetterDto,
  ) {}

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
