export class CreateKakaoUserDto {
  kakaoId: string;
  nickname: string;
  profile_image: string;
  email: string;
  age_range: string;
  birthday: string;
  gender: string;
  allow_scope: string;
  is_allow_friend: boolean;
}
