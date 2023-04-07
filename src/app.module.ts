import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './domain/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { NoticeModule } from './domain/notice/notice.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Notice } from './domain/notice/entities/notice.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './domain/users/entities/user.entity';
import { UserInfo } from './domain/users/entities/userInfo.entity';
import { Social } from './domain/users/entities/social.entity';
import { Friend } from './domain/friend/entities/friend.entity';
import { LetterModule } from './domain/letter/letter.module';
import { ReceivedLetter } from './domain/letter/entities/receivedLetter.entity';
import { ReminderModule } from './domain/reminder/reminder.module';
import { Reminder } from './domain/reminder/entities/reminder.entity';
import { LetterBody } from './domain/letter/entities/letterBody.entity';
import { Reply } from './domain/reply/entities/reply.entity';
import { Relationship } from './domain/relationship/entities/relationship.entity';
import { SendLetter } from './domain/letter/entities/sendLetter.entity';
import { SentenceModule } from './domain/sentence/sentence.module';
import { Sentence } from './domain/sentence/entities/sentence.entity';
import { ReplyModule } from './domain/reply/reply.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { FriendModule } from './domain/friend/friend.module';
import winstonDaily from 'winston-daily-rotate-file';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './common/exceptions/httpExceptionFilter';
import { KakaoModule } from './domain/kakao/kakao.module';

const ConfigSettingModule = ConfigModule.forRoot({
  isGlobal: true,
});

const TypeOrmSettingModule = TypeOrmModule.forRoot({
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT, 10) || 3306,
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DB,
  timezone: 'Asia/Seoul',

  entities: [
    Notice,
    User,
    UserInfo,
    Social,
    Friend,
    ReceivedLetter,
    LetterBody,
    Reply,
    Relationship,
    SendLetter,
    Reminder,
    Sentence,
  ],

  synchronize: false,
  logging: 'all',
});

const RedisSettingModule = RedisModule.forRoot({
  config: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
  },
});

const logDir = 'logs';

const dailyLoggerOptions = (level: string) => {
  return {
    level,
    datePattern: 'YYYY-MM-DD',
    dirname: logDir + `/${level}`,
    filename: `${level}-%DATE%.log`,
    maxFiles: '14d',
    zippedArchive: true,
  };
};

const WinstomSettingModule = WinstonModule.forRoot({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        nestWinstonModuleUtilities.format.nestLike('ggo-geet', {
          prettyPrint: true,
        }),
      ),
    }),
    new winstonDaily(dailyLoggerOptions('error')),
    new winstonDaily(dailyLoggerOptions('warn')),
    new winstonDaily(dailyLoggerOptions('info')),
  ],
});

@Module({
  imports: [
    ConfigSettingModule,
    TypeOrmSettingModule,
    RedisSettingModule,
    WinstomSettingModule,
    UsersModule,
    NoticeModule,
    AuthModule,
    LetterModule,
    SentenceModule,
    ReminderModule,
    ReplyModule,
    FriendModule,
    KakaoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
