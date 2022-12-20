import {
  Body,
  Controller,
  Get,
  Header,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CallbackType } from 'src/constants/kakaocallback.constant';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async kakaoLogin(@Body('code') code: string, @Res() res) {
    // 인증 코드로 카카오 토큰 받아오기
    const codeResponse = await this.authService.getKakaoAccessToken(
      code,
      CallbackType.LOGIN,
    );
    // 토큰으로 사용자 정보 받아오기
    const { statusCode, user } = await this.authService.getUserProfile(
      codeResponse,
    );
    // 친구 목록, 메세지 동의했으면 회원가입할때 친구 바로 저장
    if (codeResponse.scope.indexOf('friends') !== -1) {
      await this.authService.updateKakaoFriends(
        codeResponse.access_token,
        user,
      );
    }
    // user.id로 jwt 토큰 발급
    const jwtAccessToken = await this.authService.getAccessToken(user.id);
    const jwtRefreshToken = await this.authService.getRefreshToken(user.id);
    return res.status(statusCode).send({ jwtAccessToken, jwtRefreshToken });
  }

  // 추가 동의항목 동의 후 친구목록 반환
  @Get('/friends')
  async addAgreeCategory(@Body('code') code: string, @Res() res) {
    const codeResponse = await this.authService.getKakaoAccessToken(
      code,
      CallbackType.FRIEND,
    );
    const { statusCode, user } = await this.authService.getUserProfile(
      codeResponse,
    );

    await this.authService.updateKakaoFriends(codeResponse.access_token, user);
    return res.send(await this.authService.getKakaoFriends(user));
  }

  //-----------------------------------------------------------------------------------------------------------
  // 백에서 테스트용 (로그인할때 body에 넣을 code값)
  @Get('/code/login')
  async getCodeForLoginTest(@Res() res) {
    const _hostName = 'https://kauth.kakao.com';
    const _restApiKey = process.env.KAKAO_CLIENT_ID;
    // 카카오 로그인 redirectURI 등록
    const _redirectUrl = 'http://localhost:3000/auth/kakao/login';
    const url = `${_hostName}/oauth/authorize?client_id=${_restApiKey}&redirect_uri=${_redirectUrl}&response_type=code`;
    return res.redirect(url);
  }

  // 백에서 테스트용 (친구 가져올때 body에 넣을 code값)
  @Get('/code/friends')
  async getCodeForFriendsTest(@Res() res) {
    const _hostName = 'https://kauth.kakao.com';
    const _restApiKey = process.env.KAKAO_CLIENT_ID;
    // 카카오 로그인 redirectURI 등록
    const _redirectUrl = 'http://localhost:3000/auth/kakao/friends';
    const url = `${_hostName}/oauth/authorize?client_id=${_restApiKey}&redirect_uri=${_redirectUrl}&response_type=code&scope=friends,talk_message`;
    return res.redirect(url);
  }

  @Get('/kakao/login')
  async kakaoLoginTest(@Query('code') code: string, @Res() res) {
    return res.send({ scope: 'login', code });
  }

  @Get('/kakao/friends')
  async kakaoFriendsTest(@Query('code') code: string, @Res() res) {
    return res.send({ scope: 'friends', code });
  }
}
