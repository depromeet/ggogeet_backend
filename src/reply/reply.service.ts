import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LetterBody } from 'src/letter/entities/letterbody.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateReplyDto } from './dtos/requests/create-reply.request.dto';
import { Reply } from './entities/reply.entity';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(Reply)
    private replyRepository: Repository<Reply>,
    
    @InjectRepository(LetterBody)
    private letterBodyRepository: Repository<LetterBody>,
  ) {}

  async createReply(replyDto: CreateReplyDto, user: User) {
    // TODO: 답장 쓸수 있는 편지인지 권한 확인 erd 부터 정립필요.

    const letterBody = await this.letterBodyRepository.findOne({where: { id: replyDto.letterBodyId }, relations: ["reply"]});

    if (!letterBody) throw new NotFoundException(`LetterBody #${replyDto.letterBodyId} not found`);
    if (letterBody.reply) throw new ConflictException(`Reply already exists`);

    const reply = new Reply();
    reply.content = replyDto.content;

    letterBody.reply = reply;

    return (await this.letterBodyRepository.save(letterBody)).reply;
  }
}
