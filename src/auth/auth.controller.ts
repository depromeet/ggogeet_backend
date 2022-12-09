import { Controller, Get, Header, Query, Res } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/kakao')
  @Header('Content-Type', 'text/html')
  kakaoLoginLogic(@Res() res): void {
    const _hostName = 'https://kauth.kakao.com';
    const _restApiKey = process.env.KAKAO_CLIENT_ID;
    // 카카오 로그인 redirectURI 등록
    const _redirectUrl = process.env.KAKAO_REDIRECT_URL;
    const url = `${_hostName}/oauth/authorize?client_id=${_restApiKey}&redirect_uri=${_redirectUrl}&response_type=code`;
    return res.redirect(url);
  }

  // redirect url의 parameter code={code}로 인가코드가 전달됨
  @Get('/kakao/callback')
  async kakaoLogin(@Query('code') code: string, @Res() res) {
    // 인증 코드 요청 전달
    const codeResponse = await this.authService.getKakaoAccessToken(code);

    // 인증 코드로 토큰 전달
    const user = await this.authService.getUserProfile(codeResponse);

    // 친구 목록 동의했으면 회원가입할때 친구 바로 저장
    if (codeResponse.scope.indexOf('friends') !== -1) {
      await this.authService.updateKakaoFriends(
        codeResponse.access_token,
        user,
      );
    }

    // user.id로 jwt 토큰 발급
    const jwtAccessToken = await this.authService.getAccessToken(user.id);

    res.send({
      jwtAccessToken,
      message: 'success',
    });
  }

  // 카카오 친구 불러오기
  @Get('/friends')
  @Header('Content-Type', 'text/html')
  kakaoFriendLogic(@Res() res): void {
    const _hostName = 'https://kauth.kakao.com';
    const _restApiKey = process.env.KAKAO_CLIENT_ID;
    // 카카오 로그인 redirectURI 등록
    const _redirectUrl = process.env.KAKAO_FRIENDS_REDIRECT_URL;
    const url = `${_hostName}/oauth/authorize?client_id=${_restApiKey}&redirect_uri=${_redirectUrl}&response_type=code&scope=friends`;
    return res.redirect(url);
  }

  // redirect url의 parameter code={code}로 인가코드가 전달됨
  @Get('/kakao/friends')
  async kakao(@Query('code') code: string, @Res() res) {
    const codeResponse = await this.authService.getKakaoAccessToken(
      code,
      'friends',
    );
    const user = await this.authService.getUserProfile(codeResponse);

    await this.authService.updateKakaoFriends(codeResponse.access_token, user);

    const friendsList = await this.authService.getKakaoFriends(user);
    return res.send(friendsList);
  }
}
