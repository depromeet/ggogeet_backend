import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { SendLetter } from './entities/sendLetter.entity';
import { Repository } from 'typeorm';
import { findAllSentLetterDto } from './dto/requests/findAllLetter.request.dto';
import { PaginationBuilder } from 'src/common/paginations/paginationBuilder.response';

@Injectable()
export class LetterSentService {
  constructor(
    @InjectRepository(SendLetter)
    private sendLetterRepository: Repository<SendLetter>,
  ) {}

  async findAll(
    user: User,
    query: findAllSentLetterDto,
  ): Promise<SendLetter[]> {
    const order = query.order === 'ASC' ? 'ASC' : 'DESC';

    const letter = this.sendLetterRepository
      .createQueryBuilder('sendLetter')
      .where('senderId = :id', { id: user.id });

    if (query.startDate !== undefined && query.endDate !== undefined) {
      letter.andWhere('sendAt BETWEEN :startDate AND :endDate', {
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
      .leftJoinAndSelect('sendLetter.letterBody', 'letterBody')
      .select(['sendLetter.id', 'sendLetter.sendAt'])
      .skip(query.getSkip())
      .take(query.getTake())
      .orderBy('sendAt', order)
      .getManyAndCount();

    return new PaginationBuilder()
      .setData(data)
      .setTotalCount(count)
      .setPage(query.getPage())
      .setTake(query.getTake())
      .build();
  }

  async findOne(user: User, id: number): Promise<SendLetter> {
    const letter = await this.sendLetterRepository.findOne({
      where: { id: id, sender: { id: user.id } },
      relations: ['letterBody'],
    });
    if (!letter) {
      throw new Error('There is no id');
    }
    return letter;
  }

  async delete(user: User, id: number): Promise<void> {
    const result = await this.sendLetterRepository.softDelete(id);
    if (result.affected === 0) {
      throw new Error('There is no id');
    }
  }
}
