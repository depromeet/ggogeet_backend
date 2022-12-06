import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { KakaoStrategy } from 'src/auth/strategy/kakao.strategy';
import { Social } from 'src/users/entities/social.entity';
import { User } from 'src/users/entities/user.entity';
import { UserInfo } from 'src/users/entities/userinfo.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME,
      },
    }),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([UserInfo]),
    TypeOrmModule.forFeature([Social]),
  ],
  controllers: [AuthController],
  providers: [AuthService, KakaoStrategy, JwtStrategy],
  exports: [AuthService, JwtModule, PassportModule, KakaoStrategy, JwtStrategy],
})
export class AuthModule {}