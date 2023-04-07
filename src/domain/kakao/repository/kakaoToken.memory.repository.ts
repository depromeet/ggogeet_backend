import { DEFAULT_REDIS_NAMESPACE, InjectRedis } from '@liaoliaots/nestjs-redis';
import { KakaoToken } from '../kakaoToken';
import Redis from 'ioredis';
import { KakaoService } from '../kakao.service';
import { InternalServerErrorException } from '@nestjs/common';

export class KakaoTokenRepository {
  constructor(
    @InjectRedis(DEFAULT_REDIS_NAMESPACE) private readonly redis: Redis,
    private readonly kakaoService: KakaoService,
  ) {}

  async save(userId: number, kakaoToken: KakaoToken): Promise<void> {
    const { accessTokenKey, refreshTokenKey } = this.getTokenKey(userId);

    await this.redis.set(
      accessTokenKey,
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
    const { accessTokenKey, refreshTokenKey } = this.getTokenKey(userId);
    const acessToken = await this.redis.get(accessTokenKey);
    const expiresIn = await this.redis.ttl(accessTokenKey);
    const refreshToken = await this.redis.get(refreshTokenKey);
    const refreshTokenExpiresIn = await this.redis.ttl(refreshTokenKey);
    if (acessToken === null) {
      try {
        const { access_token, expires_in } =
          await this.kakaoService.refreshKakaoAccessToken(refreshToken);
        await this.save(
          userId,
          new KakaoToken(
            access_token,
            refreshToken,
            expires_in,
            refreshTokenExpiresIn,
          ),
        );
      } catch (e) {
        throw new InternalServerErrorException({
          message: 'Cannot refresh Kakao access token',
          error: 'KAKAO_REFRESH_TOKEN_ERROR',
        });
      }
    }

    return new KakaoToken(
      acessToken,
      refreshToken,
      expiresIn,
      refreshTokenExpiresIn,
    );
  }

  private getTokenKey(userId: number): {
    accessTokenKey: string;
    refreshTokenKey: string;
  } {
    return {
      accessTokenKey: `${userId.toString()}:accessToken`,
      refreshTokenKey: `${userId.toString()}:refreshToken`,
    };
  }
}
