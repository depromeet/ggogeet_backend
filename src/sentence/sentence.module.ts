import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { Situation } from 'src/situation/entities/situation.entity';
import { User } from 'src/users/entities/user.entity';
import { Sentence } from './entities/sentence.entity';
import { SentenceController } from './sentence.controller';
import { SentenceService } from './sentence.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Sentence, Situation, User]),
    PassportModule,
    AuthModule,
  ],
  controllers: [SentenceController],
  providers: [SentenceService, JwtStrategy],
})
export class SentenceModule {}
