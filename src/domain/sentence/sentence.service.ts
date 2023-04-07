import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SentenceType } from 'src/domain/sentence/sentence.constant';
import { User } from 'src/domain/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateSentenceDto } from './dto/requests/createSentence.request.dto';
import { SentenceResponseDto } from './dto/responses/sentence.response.dto';
import { Sentence } from './entities/sentence.entity';

@Injectable()
export class SentenceService {
  constructor(
    @InjectRepository(Sentence)
    private sentenceRepository: Repository<Sentence>,
  ) {}

  async findOne(user: User, id: number): Promise<SentenceResponseDto> {
    const sentence = await this.sentenceRepository.findOne({
      where: { id: id, userId: user.id },
    });

    if (!sentence) {
      throw new NotFoundException({
        type: 'NOT_FOUND',
        message: `Sentence #${id} not found`,
      });
    }

    return new SentenceResponseDto(sentence);
  }

  async findUserSentenceBySituation(userId: number, situationId: number) {
    const sentenceList = await this.sentenceRepository
      .createQueryBuilder('sentence')
      .where('sentence.userId = :id', { id: userId })
      .andWhere('sentence.type = :type', { type: SentenceType.USER })
      .andWhere('sentence.situationId = :situationId', {
        situationId: situationId,
      })
      .take(5)
      .getMany();
    return sentenceList.map((sentence) => {
      return new SentenceResponseDto(sentence);
    });
  }

  async findGuideSentenceBySituation(situationId: number) {
    const sentenceList = await this.sentenceRepository
      .createQueryBuilder('sentence')
      .andWhere('sentence.type = :type', { type: SentenceType.GUIDE })
      .andWhere('sentence.situationId = :situationId', {
        situationId: situationId,
      })
      .orderBy('rand ()')
      .take(5)
      .getMany();
    return sentenceList.map((sentence) => {
      return new SentenceResponseDto(sentence);
    });
  }

  async createSentence(
    user: User,
    sentenceDto: CreateSentenceDto,
  ): Promise<SentenceResponseDto> {
    const newSentence = new Sentence();
    newSentence.type = SentenceType.USER;
    newSentence.userId = user.id;
    newSentence.situationId = sentenceDto.situationId;
    newSentence.isShared = sentenceDto.isShared;
    newSentence.content = sentenceDto.content;

    const result = await this.sentenceRepository.save(newSentence);

    return new SentenceResponseDto(result);
  }

  async deleteSentence(id: number, user: User): Promise<void> {
    const deleted = await this.sentenceRepository.delete({
      id,
      userId: user.id,
    });

    if (!deleted.affected)
      throw new NotFoundException({
        type: 'NOT_FOUND',
        message: `Sentence #${id} not found`,
      });
  }
}
