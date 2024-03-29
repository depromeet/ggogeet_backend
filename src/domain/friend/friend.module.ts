import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { Friend } from './entities/friend.entity';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { User } from 'src/domain/users/entities/user.entity';
import { KakaoService } from 'src/domain/kakao/kakao.service';
import { KakaoTokenRepository } from 'src/domain/kakao/repository/kakaoToken.memory.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friend]),
    PassportModule,
    AuthModule,
  ],
  controllers: [FriendController],
  providers: [FriendService, JwtStrategy, KakaoService, KakaoTokenRepository],
})
export class FriendModule {}
