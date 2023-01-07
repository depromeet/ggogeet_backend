import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Social } from 'src/users/entities/social.entity';
import { User } from 'src/users/entities/user.entity';
import { UserInfo } from 'src/users/entities/userInfo.entity';
import { Repository } from 'typeorm';
import { CreateKakaoUserDto } from './dto/requests/createKakaoUser.dto';
import { KakaoService } from 'src/kakao/kakao.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly userService: UsersService,
    private readonly kakaoService: KakaoService,
    private readonly jwtService: JwtService,
  ) {}

  async getKakaoAccessToken(code: string, redirectURI: string) {
    return await this.kakaoService.getKakaoAccessToken(code, redirectURI);
  }

  async getUserProfile(codeResponse) {
    try {
      const profileJson = await this.kakaoService.getKakaoProfile(
        codeResponse.access_token,
      );
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
          kakao_account.has_gender &&
          !kakao_account.kakao_gender_needs_agreement
            ? kakao_account.gender
            : null,
        allow_scope: codeResponse.scope,
        is_allow_friend:
          codeResponse.scope.indexOf('friends') !== -1 ? true : false,
      };

      // 존재하는 유저인지 확인 후 유저 정보 반환
      const user = await this.validateKakao(kakaoInfo);
      return user;
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException(e);
    }
  }

  async validateKakao(kakaoInfo: CreateKakaoUserDto) {
    const kakaoId: number = parseInt(kakaoInfo.kakaoId);
    let exUser = await this.userService.findUserBySocialId(kakaoId);

    // 새로 가입한 유저면 create
    if (!exUser) {
      const newSocial = new Social();
      newSocial.clientId = kakaoInfo.kakaoId;
      newSocial.allowFriendsList = kakaoInfo.is_allow_friend;

      const newUserInfo = new UserInfo();
      newUserInfo.email = kakaoInfo.email;
      newUserInfo.birthday = kakaoInfo.birthday;
      newUserInfo.email = kakaoInfo.email;
      newUserInfo.gender = kakaoInfo.gender;

      const newUser = new User();
      newUser.name = kakaoInfo.nickname;
      newUser.nickname = kakaoInfo.nickname;
      newUser.profileImg = kakaoInfo.profile_image;
      newUser.social = newSocial;
      newUser.userInfo = newUserInfo;

      await this.userRepository.save(newUser);
      return {
        statusCode: 201,
        user: newUser,
        allowFriendsList: newUser.social.allowFriendsList,
      };
    } else {
      // 기존 유저면 update
      exUser = await this.updateKakaoUser(exUser.id, kakaoInfo);
      return {
        statusCode: 200,
        user: exUser,
        allowFriendsList: exUser.social.allowFriendsList,
      };
    }
  }

  async getAccessToken(userId: number) {
    return this.jwtService.sign(
      { id: userId },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME,
      },
    );
  }

  async getRefreshToken(userId: number) {
    return this.jwtService.sign(
      { id: userId },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
      },
    );
  }

  async updateKakaoUser(id: number, kakaoInfo: CreateKakaoUserDto) {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: { social: true },
    });
    user.name = kakaoInfo.nickname;
    user.profileImg = kakaoInfo.profile_image;
    user.social.allowFriendsList = kakaoInfo.is_allow_friend;

    return await this.userRepository.save(user);
  }
}
