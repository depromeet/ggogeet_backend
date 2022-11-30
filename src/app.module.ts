import { Module } from '@nestjs/common';
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
import { UserInfo } from './users/entities/userinfo.entity';
import { Social } from './users/entities/social.entity';

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
  entities: [Notice, User, UserInfo, Social],
  synchronize: false,
});

@Module({
  imports: [
    ConfigSettingModule,
    TypeOrmSettingModule,
    UsersModule,
    NoticeModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
