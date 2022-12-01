import {
  Controller,
  Get,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { KakaoAuthGuard } from 'src/common/guards/kakao-auth.guard';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/login')
  @UseGuards(KakaoAuthGuard)
  async kakaoLogin(@Req() req, @Res() res): Promise<any> {
    try {
      const jwtAccessToken = await this.authService.getAccessToken(req.user.id);
      const jwtRefreshToken = await this.authService.getRefreshToken(
        req.user.id,
      );
      res.send({
        jwtAccessToken,
        jwtRefreshToken,
        message: 'success',
      });
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
