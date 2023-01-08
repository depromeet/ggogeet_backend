import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis';
import { KakaoToken } from './kakaoToken';
import Redis from 'ioredis';

export class KakaoTokenRepository {
  constructor(
    @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis,
  ) {}

  async save(userId: number, kakaoToken: KakaoToken): Promise<void> {
    const { acessTokenKey, refreshTokenKey } = this.getTokenKey(userId);

    await this.redis.set(
      acessTokenKey,
      kakaoToken.getAcessToken(),
      'EX',
      kakaoToken.getExpiresIn(),
    );

    await this.redis.set(
      refreshTokenKey,
      kakaoToken.getRefreshToken(),
      'EX',
      kakaoToken.getRefreshTokenExpiresIn(),
    );
  }

  async findByUserId(userId: number): Promise<KakaoToken> {
    const { acessTokenKey, refreshTokenKey } = this.getTokenKey(userId);
    const acessToken = await this.redis.get(acessTokenKey);
    const expiresIn = await this.redis.ttl(acessTokenKey);
    const refreshToken = await this.redis.get(refreshTokenKey);
    const refreshTokenExpiresIn = await this.redis.ttl(refreshTokenKey);

    return new KakaoToken(
      acessToken,
      refreshToken,
      expiresIn,
      refreshTokenExpiresIn,
    );
  }

  private getTokenKey(userId: number): {
    acessTokenKey: string;
    refreshTokenKey: string;
  } {
    return {
      acessTokenKey: `${userId.toString()}:acessToken`,
      refreshTokenKey: `${userId.toString()}:refreshToken`,
    };
  }
}
