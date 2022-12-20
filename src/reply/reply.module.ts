import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { LetterBody } from 'src/letter/entities/letterbody.entity';
import { Situation } from 'src/situation/entities/situation.entity';
import { User } from 'src/users/entities/user.entity';
import { Reply } from './entities/reply.entity';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Reply, LetterBody]),
    PassportModule,
  ],
  controllers: [ReplyController],
  providers: [ReplyService, ],
})
export class ReplyModule {}
