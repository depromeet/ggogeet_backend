import { ApiProperty } from '@nestjs/swagger';
import { Friend } from 'src/friend/entities/friend.entity';

export class ResponseFriendDto {
  @ApiProperty({ example: 1, description: '유저 id' })
  id: number;
  @ApiProperty({ example: 1, description: '친구 user id' })
  friendUserId: number;

  @ApiProperty({ example: 'kakao-uuid', description: '카카오 uuid' })
  kakaoUuid: string;

  @ApiProperty({ example: '친구 이름', description: '친구 이름' })
  kakaoFriendName: string;

  @ApiProperty({
    example: '친구 프로필 이미지',
    description: '친구 프로필 이미지',
  })
  friendProfileImg: string;

  @ApiProperty({ example: '2021-01-01 00:00:00', description: '생성일' })
  createdAt: Date;

  @ApiProperty({ example: '2021-01-01 00:00:00', description: '수정일' })
  updatedAt: Date;

  constructor(friend: Friend) {
    this.id = friend.id;
    this.friendUserId = friend.friendUser.id;
    this.friendProfileImg = friend.friendUser.profileImg;
    this.kakaoUuid = friend.kakaoUuid;
    this.kakaoFriendName = friend.kakaoFriendName;
    this.createdAt = friend.createdAt;
    this.updatedAt = friend.updatedAt;
  }
}
