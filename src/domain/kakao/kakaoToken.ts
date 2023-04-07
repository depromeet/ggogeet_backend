export class KakaoToken {
  private acessToken: string;
  private refreshToken: string;
  private acessTokenExpiresIn: number;
  private refreshTokenExpiresIn: number;

  constructor(
    acessToken: string,
    refreshToken: string,
    acessTokenExpiresIn: number,
    refreshTokenExpiresIn: number,
  ) {
    this.acessToken = acessToken;
    this.refreshToken = refreshToken;
    this.acessTokenExpiresIn = acessTokenExpiresIn;
    this.refreshTokenExpiresIn = refreshTokenExpiresIn;
  }

  getAcessToken(): string {
    return this.acessToken;
  }

  getExpiresIn(): number {
    return this.acessTokenExpiresIn;
  }

  getRefreshToken(): string {
    return this.refreshToken;
  }

  getRefreshTokenExpiresIn(): number {
    return this.refreshTokenExpiresIn;
  }

  setAcessToken(acessToken: string, expiresIn: number): void {
    this.acessToken = acessToken;
    this.acessTokenExpiresIn = expiresIn;
  }

  setRefressToken(refreshToken: string, expiresIn: number): void {
    this.refreshToken = refreshToken;
    this.refreshTokenExpiresIn = expiresIn;
  }
}
