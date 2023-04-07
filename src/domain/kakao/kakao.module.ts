import { Module } from '@nestjs/common';
import { KakaoTokenRepository } from './repository/kakaoToken.memory.repository';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { KakaoService } from './kakao.service';

@Module({
  imports: [RedisModule],
  controllers: [],
  providers: [KakaoTokenRepository, KakaoService],
})
export class KakaoModule {}
