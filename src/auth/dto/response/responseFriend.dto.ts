import { Friend } from 'src/users/entities/friend.entity';

export class ResponseFriendDto {
  id: number;
  friendUserId: number;
  kakaoUuid: string;
  kakaoFriendName: string;
  friendProfileImg: string;
  createdAt: Date;
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
