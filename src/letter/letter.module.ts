import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { multerAttachedImgOptionsFactory } from 'src/utils/multer.options';
import { ReceivedLetter } from './entities/receivedLetter.entity';
import { LetterController } from './letter.controller';
import { LetterService } from './letter.service';
import { PassportModule } from '@nestjs/passport';
import { SendLetter } from './entities/sendLetter.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { LetterSentService } from './letter.sent.service';
import { LetterReceivedService } from './letter.received.service';
import { Friend } from 'src/friend/entities/friend.entity';
import { KakaoService } from 'src/kakao/kakao.service';
import { KakaoTokenRepository } from 'src/kakao/repository/kakaoToken.memory.repository';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { TempLetterRepository } from './repository/tempLetter.repository';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerAttachedImgOptionsFactory,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([ReceivedLetter, User, SendLetter, Friend]),
    PassportModule,
    AuthModule,
    RedisModule,
  ],
  controllers: [LetterController],
  providers: [
    LetterService,
    LetterSentService,
    LetterReceivedService,
    JwtStrategy,
    KakaoService,
    KakaoTokenRepository,
    TempLetterRepository,
  ],
})
export class LetterModule {}
