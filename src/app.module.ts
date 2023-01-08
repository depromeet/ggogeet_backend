import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config';
import { NoticeModule } from './notice/notice.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Notice } from './notice/entities/notice.entity';
import { AuthModule } from './auth/auth.module';
import { User } from './users/entities/user.entity';
import { UserInfo } from './users/entities/userInfo.entity';
import { Social } from './users/entities/social.entity';
import { Friend } from './friend/entities/friend.entity';
import { LetterModule } from './letter/letter.module';
import { ReceivedLetter } from './letter/entities/receivedLetter.entity';
import { ReminderModule } from './reminder/reminder.module';
import { Reminder } from './reminder/entities/reminder.entity';
import { LetterBody } from './letter/entities/letterBody.entity';
import { Reply } from './reply/entities/reply.entity';
import { Relationship } from './relationship/entities/relationship.entity';
import { SendLetter } from './letter/entities/sendLetter.entity';
import { SentenceModule } from './sentence/sentence.module';
import { Sentence } from './sentence/entities/sentence.entity';
import { ReplyModule } from './reply/reply.module';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import * as winston from 'winston';
import {
  utilities as nestWinstonModuleUtilities,
  WinstonModule,
} from 'nest-winston';
import { FriendModule } from './friend/friend.module';
import winstonDaily from 'winston-daily-rotate-file';

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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
