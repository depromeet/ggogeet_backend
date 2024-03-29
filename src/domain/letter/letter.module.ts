import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/users/entities/user.entity';
import { multerAttachedImgOptionsFactory } from 'src/infrastructor/S3/s3.multer';
import { ReceivedLetter } from './entities/receivedLetter.entity';
import { LetterController } from './letter.controller';
import { LetterService } from './letter.service';
import { PassportModule } from '@nestjs/passport';
import { SendLetter } from './entities/sendLetter.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { LetterSentService } from './letter.sent.service';
import { LetterReceivedService } from './letter.received.service';
import { Friend } from 'src/domain/friend/entities/friend.entity';
import { KakaoService } from 'src/domain/kakao/kakao.service';
import { KakaoTokenRepository } from 'src/domain/kakao/repository/kakaoToken.memory.repository';
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
