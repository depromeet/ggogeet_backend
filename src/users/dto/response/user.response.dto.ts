import { ApiProperty } from '@nestjs/swagger';

export class UserResponseDto {
  @ApiProperty({
    example: 1,
    description: '유저 id',
  })
  id: number;

  @ApiProperty({
    example: '김꼬깃',
    description: '유저 이름',
  })
  name: string;

  @ApiProperty({
    example:
      'http://k.kakaocdn.net/dn/kbBXv/btrThGICmvf/DgD0mvr0IKvCKNkl4oNAI1/img_640x640.jp',
    description: '카톡 프로필 이미지 url',
  })
  profileImg: string;

  @ApiProperty({
    example: 'true',
    description: '꼬깃 메모 알림 설정 여부',
  })
  remindOn: boolean;

  @ApiProperty({
    example: 'true',
    description: '알림 설정 여부부',
  })
  alertOn: boolean;

  @ApiProperty({
    example: 'false',
    description: '웰컴 팝업 보여졌는지',
  })
  welcomePopupView: boolean;

  @ApiProperty({
    example: 'true',
    description:
      '친구 목록 가져오기 항목 동의했는지, 안했으면 /auth/friends로 추가항목 동의 후 가져올수 있습니다',
  })
  allowFriendsList: boolean;

  constructor(user: any) {
    this.id = user.id;
    this.name = user.name;
    this.profileImg = user.profileImg;
    this.remindOn = user.userInfo.remindOn;
    this.alertOn = user.userInfo.alertOn;
    this.welcomePopupView = user.userInfo.welcomePopupView;
    this.allowFriendsList = user.social.allowFriendsList;
  }
}
