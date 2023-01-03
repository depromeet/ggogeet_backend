import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { SendLetter } from './entities/sendLetter.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LetterSentService {
  constructor(
    @InjectRepository(SendLetter)
    private sendLetterRepository: Repository<SendLetter>,
  ) {}

  async findAll(user: User, sort = 'oldest'): Promise<SendLetter[]> {
    const order = sort === 'oldest' ? 1 : -1;
    const letters = this.sendLetterRepository.find({
      where: {
        sender: { id: user.id },
      },
      relations: ['letterBody'],
      order: { sendAt: order },
    });
    return letters;
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
