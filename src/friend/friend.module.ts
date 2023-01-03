import { Module } from '@nestjs/common';
import { FriendController } from './friend.controller';
import { FriendService } from './friend.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { AuthModule } from 'src/auth/auth.module';
import { Friend } from './entities/friend.entity';
import { JwtStrategy } from 'src/auth/strategy/jwt.strategy';
import { User } from 'src/users/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Friend]),
    PassportModule,
    AuthModule,
  ],
  controllers: [FriendController],
  providers: [FriendService, JwtStrategy],
})
export class FriendModule {}
