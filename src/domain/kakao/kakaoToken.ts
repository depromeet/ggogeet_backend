export class KakaoToken {
  private readonly accessToken: string;
  private readonly refreshToken: string;
  private readonly accessTokenExpiresIn: number;
  private readonly refreshTokenExpiresIn: number;

  constructor(
    accessToken: string,
    refreshToken: string,
    accessTokenExpiresIn: number,
    refreshTokenExpiresIn: number,
  ) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    this.accessTokenExpiresIn = accessTokenExpiresIn;
    this.refreshTokenExpiresIn = refreshTokenExpiresIn;
  }

  getAcessToken(): string {
    return this.accessToken;
  }

  getExpiresIn(): number {
    return this.accessTokenExpiresIn;
  }

  getRefreshToken(): string {
    return this.refreshToken;
  }

  getRefreshTokenExpiresIn(): number {
    return this.refreshTokenExpiresIn;
  }
}
