import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ResponseFriendDto } from '../domain/friend/dto/response/responseFriend.dto';
import { KakaoTokenRepository } from 'src/domain/kakao/repository/kakaoToken.memory.repository';
import { KakaoToken } from 'src/domain/kakao/kakaoToken';
import { FriendService } from 'src/domain/friend/friend.service';

@Controller('auth')
@ApiTags('Auth API')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly friendsService: FriendService,
    private readonly kakaoTokenRepository: KakaoTokenRepository,
  ) {}

  @ApiOperation({
    summary: '카카오 로그인 API',
    description:
      '카카오 로그인을 진행합니다. code는 로그인 엑세스토큰 요청을 위해 카카오에서 받은 엑세스코드입니다. callbackurl이 /login인지 확인 필요',
  })
  @Post('/login')
  @ApiBody({
    schema: {
      properties: {
        code: {
          type: 'string',
          example: 'code',
        },
        redirectURI: {
          type: 'string',
          example: 'https://ggo-geet.com/bla/bla',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK || HttpStatus.CREATED,
    description: 'Jwt Access 토큰과 Refresh 토큰을 반환합니다.',
    schema: {
      properties: {
        accessToken: {
          type: 'string',
          example: 'accessToken',
          description: 'Jwt 토큰',
        },
        refreshToken: {
          type: 'string',
          example: 'refreshToken',
          description: 'Refresh 토큰',
        },
        allowFriendsList: {
          type: 'boolean',
          example: 'true',
          description: '친구목록,메세지 동의 여부',
        },
      },
    },
  })
  async kakaoLogin(
    @Body('code') code: string,
    @Body('redirectURI') redirectURI: string,
    @Res() res,
  ) {
    // 인증 코드로 카카오 토큰 받아오기
    const codeResponse = await this.authService.getKakaoAccessToken(
      code,
      redirectURI,
    );

    const kakaoToken = new KakaoToken(
      codeResponse.access_token,
      codeResponse.refresh_token,
      codeResponse.expires_in,
      codeResponse.refresh_token_expires_in,
    );

    // 토큰으로 사용자 정보 받아오기
    const { statusCode, user, allowFriendsList } =
      await this.authService.getUserProfile(codeResponse);
    await this.kakaoTokenRepository.save(user.id, kakaoToken);

    if (allowFriendsList == true) {
      await this.friendsService.updateFriends(user);
    }

    // user.id로 jwt 토큰 발급
    const jwtAccessToken = await this.authService.getAccessToken(user.id);
    const jwtRefreshToken = await this.authService.getRefreshToken(user.id);

    res
      .status(statusCode)
      .send({ data: { jwtAccessToken, jwtRefreshToken, allowFriendsList } });
  }

  @ApiOperation({
    summary: '카카오 친구목록 API',
    description:
      '카카오 친구목록 받기 위한 추가 항목 동의를 요청하고 친구목록을 반환합니다.',
  })
  @ApiBody({
    description:
      'code는 친구목록 엑세스토큰 요청을 위해 카카오에서 받은 엑세스코드입니다. callbackurl이 /friends인지 확인 필요',
    schema: {
      properties: {
        code: {
          type: 'string',
          example: 'code',
        },
        redirectURI: {
          type: 'string',
          example: 'https://ggo-geet.com/bla/bla',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '친구목록을 반환합니다.',
    type: [ResponseFriendDto],
  })
  // 추가 동의항목 동의 후 친구목록 반환
  @Post('/kakao/friends')
  async addAgreeCategory(
    @Body('code') code: string,
    @Body('redirectURI') redirectURI: string,
    @Res() res,
  ) {
    const codeResponse = await this.authService.getKakaoAccessToken(
      code,
      redirectURI,
    );

    const { user } = await this.authService.getUserProfile(codeResponse);

    const kakaoToken = new KakaoToken(
      codeResponse.access_token,
      codeResponse.refresh_token,
      codeResponse.expires_in,
      codeResponse.refresh_token_expires_in,
    );

    await this.kakaoTokenRepository.save(user.id, kakaoToken);

    await this.friendsService.updateFriends(user);

    res.status(HttpStatus.OK).send();
  }

  //-----------------------------------------------------------------------------------------------------------
  @ApiOperation({
    summary: '카카오 로그인 테스트용 API',
    description: '로그인할때 body에 넣을 code값을 받아옵니다.',
  })
  @Get('/code/login')
  async getCodeForLoginTest(@Res() res) {
    const _hostName = 'https://kauth.kakao.com';
    const _restApiKey = process.env.KAKAO_CLIENT_ID;
    // 카카오 로그인 redirectURI 등록
    const _redirectUrl = `${process.env.FRONT_HOST}/auth/kakao/login`;
    const url = `${_hostName}/oauth/authorize?client_id=${_restApiKey}&redirect_uri=${_redirectUrl}&response_type=code`;
    return res.redirect(url);
  }

  @ApiOperation({
    summary: '카카오 친구목록 테스트용 API',
    description: '친구목록을 가져올때 body에 넣을 code값을 받아옵니다.',
  })
  @Get('/code/friends')
  async getCodeForFriendsTest(@Res() res) {
    const _hostName = 'https://kauth.kakao.com';
    const _restApiKey = process.env.KAKAO_CLIENT_ID;
    // 카카오 로그인 redirectURI 등록
    const _redirectUrl = `${process.env.FRONT_HOST}/auth/kakao/friends`;
    const url = `${_hostName}/oauth/authorize?client_id=${_restApiKey}&redirect_uri=${_redirectUrl}&response_type=code&scope=friends,talk_message`;
    return res.redirect(url);
  }

  @ApiOperation({
    summary: '카카오 로그인 Redirect API',
    description: '카카오 로그인 Redirect API',
  })
  @Get('/kakao/login')
  async kakaoLoginTest(@Query('code') code: string, @Res() res) {
    return res.send({ scope: 'login', code });
  }

  @ApiOperation({
    summary: '카카오 친구목록 Redirect API',
    description: '카카오 친구목록 Redirect API',
  })
  @Get('/kakao/friends')
  async kakaoFriendsTest(@Query('code') code: string, @Res() res) {
    return res.send({ scope: 'friends', code });
  }
}
