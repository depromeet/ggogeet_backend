import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { CreateDraftLetterDto } from './dto/requests/createDraftLetter.request.dto';

@Injectable()
export class LetterService {
  constructor() {}

  async createDraftLetter(
    user: User,
    createNewLetterDto: CreateDraftLetterDto,
  ) {
    // todo : Create User Draft Letter
  }

  async sendLetter(user: User, id: number) {
    // todo : Send Letter
  }
}
