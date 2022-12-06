import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as qs from 'qs';

import { Social } from 'src/users/entities/social.entity';
import { User } from 'src/users/entities/user.entity';
import { UserInfo } from 'src/users/entities/userinfo.entity';
import { Repository } from 'typeorm';
import axios from 'axios';
import { Friends } from 'src/users/entities/friends.entity';
import { CreateKakaoUserDto } from './dto/create-kakaouser.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Social) private socialRepository: Repository<Social>,
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
    @InjectRepository(Friends) private friendsRepository: Repository<Friends>,
    private readonly jwtService: JwtService,
  ) {}

  async getKakaoAccessToken(code: string, option?: string) {
    const kakaoTokenUrl = 'https://kauth.kakao.com/oauth/token';
    const body = {
      grant_type: 'authorization_code',
      client_id: process.env.KAKAO_CLIENT_ID,
      // redirect_uri: process.env.KAKAO_REDIRECT_URL,
      redirect_uri:
        option == 'friends'
          ? process.env.KAKAO_FRIENDS_REDIRECT_URL
          : process.env.KAKAO_REDIRECT_URL,
      code,
    };
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    };

    try {
      const response = await axios({
        // 카카오에 토큰 요청해서 받은 값
        method: 'post',
        url: kakaoTokenUrl,
        headers,
        data: qs.stringify(body),
      });
      return response.data;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async getUserProfile(codeResponse) {
    const kakaoUserInfoUrl = 'https://kapi.kakao.com/v2/user/me';
    const headerUserInfo = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: 'Bearer ' + codeResponse.access_token,
    };

    // 카카오로부터 받은 사용자 정보들 중에서 필요한 값만 담아 응답값 반환
    try {
      // 카카오로부터 받은 토큰 값 헤더에 담아 카카오 서버 /v2/user/me로 사용자 정보 요청
      const responseUserInfo = await axios({
        method: 'GET',
        url: kakaoUserInfoUrl, // "https://kapi.kakao.com/v2/user/me";
        headers: headerUserInfo,
      });

      const profileJson = responseUserInfo.data;
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
      };

      // 존재하는 유저인지 확인 후 유저 정보 반환
      const user = await this.validateKakao(kakaoInfo);
      return user;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }

  async validateKakao(kakaoInfo: CreateKakaoUserDto) {
    // select user.id from user, social where user.social_id = social.id and social.client_id =
    // const exUser = await this.socialRepository.findOneBy({
    //   client_id: kakaoInfo.kakaoId,
    // });

    const exUser = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.social', 'social')
      .where('social.client_id = :client_id', { client_id: kakaoInfo.kakaoId })
      .getOne();

    if (!exUser) {
      const newSocial = new Social();
      newSocial.client_id = kakaoInfo.kakaoId;
      if (kakaoInfo.allow_scope.indexOf('friends') !== -1) {
        newSocial.allow_friends_list = true;
      }

      const newUserInfo = new UserInfo();
      newUserInfo.email = kakaoInfo.email;
      newUserInfo.birthday = kakaoInfo.birthday;
      newUserInfo.email = kakaoInfo.email;
      newUserInfo.gender = kakaoInfo.gender;

      const newUser = new User();
      newUser.name = kakaoInfo.nickname;
      newUser.nickname = kakaoInfo.nickname;
      newUser.profile_img = kakaoInfo.profile_image;
      newUser.social = newSocial;
      newUser.userinfo = newUserInfo;

      await this.userRepository.save(newUser);

      return newUser;
    } else {
      return exUser;
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

  async createKakaoFriends(accessToken, user) {
    const kakaoFriendsUrl = 'https://kapi.kakao.com/v1/api/talk/friends';

    const header = {
      'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      Authorization: `Bearer ${accessToken}`,
    };

    const responseFriendsInfo = await axios({
      // 카카오 access 토큰으로 유저 친구 목록 요청
      method: 'GET',
      url: kakaoFriendsUrl,
      headers: header,
    });
    if (responseFriendsInfo.status === 200) {
      // 1. 친구 id쫙 뽑아온다음에 in [id리스트]해서 다시 돌아가면서 insert 해주기 (join 한번)
      // 2. social에서 kakao id로 찾은 다음 user_id 반환해서 friend에 넣어주기

      // 2번 선택
      if (responseFriendsInfo.data.total_count > 0) {
        responseFriendsInfo.data.elements.map(async (element) => {
          const friend = new Friends();
          friend.kakao_uuid = element.uuid;
          // 친구의 social 아이디 찾고
          const social = await this.socialRepository.findOneBy({
            client_id: element.id,
          });
          // 친구의 user 아이디 찾고
          const friend_user_id = await this.userRepository.findOneBy({
            social: social,
          });

          // 그 아이디를 넣어주기
          friend.friend_user_id = friend_user_id;
          friend.user_id = user;

          await this.friendsRepository.save(friend);
        });
      }
    }
    return JSON.stringify(responseFriendsInfo.data);
  }

  async findUserByClientId(clientId: number) {
    return await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.social', 'social')
      .where('social.client_id = :client_id', { client_id: clientId })
      .getOne();
  }
}
