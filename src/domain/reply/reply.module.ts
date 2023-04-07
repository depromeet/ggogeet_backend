import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LetterBody } from 'src/domain/letter/entities/letterBody.entity';
import { Reply } from './entities/reply.entity';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';

@Module({
  imports: [TypeOrmModule.forFeature([Reply, LetterBody]), PassportModule],
  controllers: [ReplyController],
  providers: [ReplyService],
})
export class ReplyModule {}
