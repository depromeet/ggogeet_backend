import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SentenceType } from 'src/constants/sentence.constant';
import { Situation } from 'src/situation/entities/situation.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import { CreateSentenceDto } from './dto/create-sentence.dto';
import { DeleteSentenceDto } from './dto/delete-sentence.dto';
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

  async findOne(user: User, id: number) {
    const sentence = await this.sentenceRepository.findOne({
      where: { id: id, userId: user.id },
    });

    if (!sentence) {
      throw new NotFoundException(`Sentence ${id} is not found`);
    }

    return {
      status: 200,
      description: '내가 쓴 문장 조회 성공',
      success: true,
      data: sentence,
    };
  }

  async findUserSentenceBySituation(userId: number, situationId: number) {
    const temp = await this.sentenceRepository
      .createQueryBuilder('sentence')
      .select('sentence.id')
      .addSelect('sentence.content')
      .where('sentence.userId = :id', { id: userId })
      .andWhere('sentence.type = :type', { type: SentenceType.USER })
      .andWhere('sentence.situation_id = :situation_id', {
        situation_id: situationId,
      })
      .take(7)
      .getMany();
    return { situation_id: situationId, sentence: temp };
  }

  async findGuideSentenceBySituation(situationId: number) {
    const temp = await this.sentenceRepository
      .createQueryBuilder('sentence')
      .select('sentence.id')
      .addSelect('sentence.content')
      .andWhere('sentence.type = :type', { type: SentenceType.GUIDE })
      .andWhere('sentence.situation_id = :situation_id', {
        situation_id: situationId,
      })
      .orderBy('rand ()')
      .take(5)
      .getMany();
    return { situation_id: situationId, sentence: temp };
  }

  async createSentence(user: User, sentenceDto: CreateSentenceDto) {
    const newSentence = new Sentence();
    newSentence.type = SentenceType.USER;
    newSentence.userId = user.id;
    newSentence.situation = await this.situationRepository.findOne({
      where: { id: sentenceDto.situation_id },
    });
    newSentence.is_shared = sentenceDto.is_shared;
    newSentence.content = sentenceDto.content;

    return await this.sentenceRepository.save(newSentence);
  }

  async deleteSentence(id: number, user: User): Promise<DeleteSentenceDto> {
    const result = new DeleteSentenceDto();

    const deleted = await this.sentenceRepository.delete({
      id,
      userId: user.id,
    });

    // DeleteResult { raw: [], affected: 1 }

    if (!deleted.affected)
      throw new NotFoundException(`Sentence #${id} not found`);

    result.status = 'success';
    result.msg = `Notice #${id} deleted`;

    return result;
  }
}
