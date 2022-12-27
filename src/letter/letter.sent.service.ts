import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class LetterSentService {
  constructor() {}

  async findAll(user: User, page: number) {
    // todo : Create User Draft Letter
  }

  async findOne(user: User, id: number) {
    // todo : Find Sent Letter
  }

  async delete(user: User, id: number) {}
}
