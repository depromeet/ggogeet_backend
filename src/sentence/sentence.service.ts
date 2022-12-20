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

  async findAll(user: User): Promise<any> {
    const userSentence = [];
    const guideSentence = [];

    for (let situationId = 1; situationId < 9; situationId++) {
      const tempUserSentence = await this.findUserSentenceBySituation(
        user.id,
        situationId,
      );
      const tempGuideSentence = await this.findGuideSentenceBySituation(
        situationId,
      );

      userSentence.push(tempUserSentence);
      guideSentence.push(tempGuideSentence);
    }

    return { userSentence, guideSentence };
  }

  async findOne(user: User, id: number): Promise<SentenceResponseDto> {
    const sentence = await this.sentenceRepository.findOne({
      where: { id: id, userId: user.id },
    });
    console.log(sentence);

    if (!sentence) {
      throw new NotFoundException({
        type: 'NOT_FOUND',
        message: `Sentence #${id} not found`,
      });
    }

    const result = new SentenceResponseDto();
    result.id = sentence.id;
    result.situationId = sentence.situationId;
    result.isShared = sentence.isShared;
    result.type = sentence.type;
    result.createdAt = sentence.createdAt;

    return result;
  }

  async findUserSentenceBySituation(userId: number, situationId: number) {
    const temp = await this.sentenceRepository
      .createQueryBuilder('sentence')
      .select('sentence.id')
      .addSelect('sentence.content')
      .where('sentence.userId = :id', { id: userId })
      .andWhere('sentence.type = :type', { type: SentenceType.USER })
      .andWhere('sentence.situationId = :situationId', {
        situationId: situationId,
      })
      .take(7)
      .getMany();
    return { situationId: situationId, sentence: temp };
  }

  async findGuideSentenceBySituation(situationId: number) {
    const temp = await this.sentenceRepository
      .createQueryBuilder('sentence')
      .select('sentence.id')
      .addSelect('sentence.content')
      .andWhere('sentence.type = :type', { type: SentenceType.GUIDE })
      .andWhere('sentence.situationId = :situationId', {
        situationId: situationId,
      })
      .orderBy('rand ()')
      .take(5)
      .getMany();
    return { situationId: situationId, sentence: temp };
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

    const saved = await this.sentenceRepository.save(newSentence);

    const result = new SentenceResponseDto();
    result.id = saved.id;
    result.situationId = saved.situation.id;
    result.isShared = saved.isShared;
    result.type = saved.type;
    result.createdAt = saved.createdAt;

    return result;
  }

  async deleteSentence(id: number, user: User): Promise<DeleteSentenceDto> {
    const result = new DeleteSentenceDto();

    const deleted = await this.sentenceRepository.delete({
      id,
      userId: user.id,
    });

    // DeleteResult { raw: [], affected: 1 }

    if (!deleted.affected)
      throw new NotFoundException({
        type: 'NOT_FOUND',
        message: `Sentence #${id} not found`,
      });

    result.type = 'SUCCESS';
    result.message = `Sentence #${id} is deleted`;

    return result;
  }
}
