import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-kakao';
import { Injectable } from '@nestjs/common';
import { CreateKakaoUserDto } from 'src/users/dto/create-kakaouser.dto';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class KakaoStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.KAKAO_CLIENT_ID,
      callbackURL: process.env.KAKAO_REDIRECT_URL,
    });
  }

  async validate(accessToken, refreshToken, profile, done) {
    const profileJson = profile._json;
    const kakao_account = profileJson.kakao_account;

    const kakaoInfo: CreateKakaoUserDto = {
      kakaoId: profileJson.id,
      nickname: profileJson.properties.nickname,
      profile_image: profileJson.properties.profile_image,
      email:
        kakao_account.has_email && !kakao_account.kakao_email_needs_agreement
          ? kakao_account.email
          : null,
      age_range:
        kakao_account.has_age_range &&
        !kakao_account.kakao_age_range_needs_agreement
          ? kakao_account.age_range
          : null,
      birthday:
        kakao_account.has_birthday &&
        !kakao_account.kakao_birthday_needs_agreement
          ? kakao_account.birthday
          : null,
      gender:
        kakao_account.has_gender && !kakao_account.kakao_gender_needs_agreement
          ? kakao_account.gender
          : null,
    };

    const user = await this.authService.validateKakao(kakaoInfo);

    done(null, user);
  }
}
