import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateKakaoUserDto } from 'src/users/dto/create-kakaouser.dto';
import { Social } from 'src/users/entities/social.entity';
import { User } from 'src/users/entities/user.entity';
import { UserInfo } from 'src/users/entities/userinfo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Social) private socialRepository: Repository<Social>,
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
    private readonly jwtService: JwtService,
  ) {}

  async validateKakao(kakaoInfo: CreateKakaoUserDto) {
    const exUser = await this.socialRepository.findOneBy({
      client_id: kakaoInfo.kakaoId,
    });

    if (!exUser) {
      const newSocial = new Social();
      newSocial.client_id = kakaoInfo.kakaoId;
      // newSocial.allow_friends_list =

      const newUserInfo = new UserInfo();
      newUserInfo.email = kakaoInfo.email;
      newUserInfo.birthday = kakaoInfo.birthday;
      newUserInfo.email = kakaoInfo.email;
      newUserInfo.gender = kakaoInfo.gender;

      const newUser = new User();
      newUser.name = kakaoInfo.nickname;
      newUser.nickname = kakaoInfo.nickname;
      newUser.profile_img = kakaoInfo.profile_image;
      newUser.social_id = newSocial;
      newUser.user_info_id = newUserInfo;

      await this.userRepository.save(newUser);

      return newUser;
    } else {
      return exUser;
    }
  }

  async getAccessToken(userId: string) {
    return this.jwtService.sign(
      { id: userId },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_ACCESS_EXPIRATION_TIME,
      },
    );
  }

  async getRefreshToken(userId: string) {
    return this.jwtService.sign(
      { id: userId },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: process.env.JWT_REFRESH_EXPIRATION_TIME,
      },
    );
  }
}
