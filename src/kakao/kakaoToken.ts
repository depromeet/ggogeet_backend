export class KakaoToken {
  private acessToken: string;
  private refreshToken: string;
  private acessTokenExpiresIn: number;
  private acessTokenExpiresAt: Date;
  private refreshTokenExpiresIn: number;
  private refreshTokenExpiresAt: Date;
  private tokenType: string;
  private scope: string;

  constructor(
    acessToken: string,
    refreshToken: string,
    acessTokenExpiresIn: number,
    refreshTokenExpiresIn: number,
    tokenType: string,
    scope: string,
  ) {
    this.acessToken = acessToken;
    this.refreshToken = refreshToken;
    this.acessTokenExpiresIn = acessTokenExpiresIn;
    this.acessTokenExpiresAt = new Date(
      new Date().getTime() + acessTokenExpiresIn * 1000,
    );
    this.refreshTokenExpiresIn = refreshTokenExpiresIn;
    this.refreshTokenExpiresAt = new Date(
      new Date().getTime() + refreshTokenExpiresIn * 1000,
    );
    this.tokenType = tokenType;
    this.scope = scope;
  }

  getAcessToken(): string {
    if (this.acessTokenExpiresAt.getTime() > new Date().getTime()) {
      return this.acessToken;
    }
    // todo : acess token refresh
    return this.acessToken;
  }

  getRefreshToken(): string {
    return this.refreshToken;
  }

  setAcessToken(acessToken: string, expiresIn: number): void {
    this.acessToken = acessToken;
    this.acessTokenExpiresIn = expiresIn;
  }

  setRefressToken(refreshToken: string, expiresIn: number): void {
    this.refreshToken = refreshToken;
    this.refreshTokenExpiresIn = expiresIn;
  }

  toStirng(): string {
    return `acessToken: ${this.acessToken}, refreshToken: ${this.refreshToken}, acessTokenExpiresIn: ${this.acessTokenExpiresIn}, acessTokenExpiresAt: ${this.acessTokenExpiresAt}, refreshTokenExpiresIn: ${this.refreshTokenExpiresIn}, refreshTokenExpiresAt: ${this.refreshTokenExpiresAt}, tokenType: ${this.tokenType}, scope: ${this.scope}`;
  }
}
