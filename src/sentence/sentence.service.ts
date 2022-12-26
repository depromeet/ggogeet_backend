import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SentenceType } from 'src/constants/sentence.constant';
import { Situation } from 'src/situation/entities/situation.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateSentenceDto } from './dto/createSentence.dto';
import { DeleteSentenceDto } from './dto/deleteSentence.dto';
import { SentenceResponseDto } from './dto/sentence.response.dto';
import { Sentence } from './entities/sentence.entity';

@Injectable()
export class SentenceService {
  constructor(
    @InjectRepository(Sentence)
    private sentenceRepository: Repository<Sentence>,
    @InjectRepository(Situation)
    private situationRepository: Repository<Situation>,
  ) {}

  async findAll(user: User, query: any): Promise<any> {
    let userSentence: any;
    let guideSentence: any;
    if (query.situation) {
      const situationId: number = parseInt(query.situation);
      userSentence = await this.findUserSentence(user.id, situationId);
      guideSentence = await this.findGuideSentence(situationId);
    } else {
      userSentence = await this.findUserSentence(user.id);
      guideSentence = await this.findGuideSentence();
    }

    return { userSentence, guideSentence };
  }

  async findOne(user: User, id: number): Promise<SentenceResponseDto> {
    const sentence = await this.sentenceRepository.findOne({
      where: { id: id },
    });

    if (
      !sentence ||
      (sentence.is_shared === false && sentence.userId !== user.id)
    ) {
      throw new NotFoundException({
        type: 'NOT_FOUND',
        message: `Sentence #${id} not found`,
      });
    }

    return new SentenceResponseDto(sentence);
  }

  async findUserSentence(
    userId: number,
    situationId?: number,
    limit: number = 7,
  ) {
    let constraint = {
      type: SentenceType.USER,
      userId: userId,
    };

    if (situationId) {
      constraint['situationId'] = situationId;
    }

    const result = await this.sentenceRepository.find({
      where: constraint,
      order: {
        my_preference: 'DESC',
      },
      take: limit,
      select: ['id', 'content'],
    });

    return { situation_id: situationId, sentence: result };
  }

  async findGuideSentence(situationId?: number, limit: number = 5) {
    let constraint = {
      type: SentenceType.GUIDE,
    };

    if (situationId) {
      constraint['situationId'] = situationId;
    }

    const result = await this.sentenceRepository.find({
      where: constraint,
      order: {
        total_preference: 'DESC',
      },
      take: limit,
      select: ['id', 'content'],
    });

    return { situation_id: situationId, sentence: result };
  }

  async createSentence(
    user: User,
    sentenceDto: CreateSentenceDto,
  ): Promise<SentenceResponseDto> {
    const newSentence = new Sentence();
    newSentence.type = SentenceType.USER;
    newSentence.userId = user.id;
    newSentence.situation = await this.situationRepository.findOne({
      where: { id: sentenceDto.situationId },
    });
    newSentence.isShared = sentenceDto.isShared;
    newSentence.content = sentenceDto.content;

    const result = await this.sentenceRepository.save(newSentence);
    return new SentenceResponseDto(result);
  }

  async deleteSentence(id: number, user: User): Promise<DeleteSentenceDto> {
    const deleted = await this.sentenceRepository.softDelete({
      id,
      userId: user.id,
    });

    if (!deleted.affected)
      throw new NotFoundException({
        type: 'NOT_FOUND',
        message: `Sentence #${id} not found`,
      });

    return new DeleteSentenceDto('SUCCESS', `Sentence #${id} is deleted`);
  }
}
