import { Module } from '@nestjs/common';
import { KakaoTokenRepository } from './kakaoToken.memory.repository';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [RedisModule],
  controllers: [],
  providers: [KakaoTokenRepository],
})
export class KakaoModule {}
