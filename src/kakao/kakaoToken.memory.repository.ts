import { KakaoToken } from './kakaoToken';

export class KakaoTokenRepository {
  private static store: Map<number, KakaoToken> = new Map();

  public save(userId: number, kakaoToken: KakaoToken): void {
    KakaoTokenRepository.store.set(userId, kakaoToken);
  }

  public findByUserId(userId: number): KakaoToken {
    const result = KakaoTokenRepository.store.get(userId);
    return result;
  }
}
