import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { multerAttachedImgOptionsFactory } from 'src/utils/multer.options';
import { LetterInfo } from './entities/letterinfo.entity';
import { ReceiveLetter } from './entities/receiveletter.entity';
import { LetterController } from './letter.controller';
import { LetterService } from './letter.service';
import { PassportModule } from '@nestjs/passport';
import { SendLetter } from './entities/sendLetter.entity';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: multerAttachedImgOptionsFactory,
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([ReceiveLetter, LetterInfo, User, SendLetter]),
    PassportModule,
  ],
  controllers: [LetterController],
  providers: [LetterService],
})
export class LetterModule {}
