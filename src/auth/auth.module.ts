import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { Social } from 'src/domain/users/entities/social.entity';
import { User } from 'src/domain/users/entities/user.entity';
import { UserInfo } from 'src/domain/users/entities/userInfo.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { KakaoService } from 'src/domain/kakao/kakao.service';
import { Friend } from 'src/domain/friend/entities/friend.entity';
import { UsersService } from 'src/domain/users/users.service';
import { FriendService } from 'src/domain/friend/friend.service';
import { KakaoTokenRepository } from 'src/domain/kakao/repository/kakaoToken.memory.repository';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME,
      },
    }),
    TypeOrmModule.forFeature([User, UserInfo, Social, Friend]),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    KakaoService,
    UsersService,
    FriendService,
    KakaoTokenRepository,
  ],
  exports: [AuthService, JwtModule, PassportModule, JwtStrategy],
})
export class AuthModule {}
