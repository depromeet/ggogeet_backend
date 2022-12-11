import { Friend } from 'src/users/entities/friend.entity';

export class ResponseFriendDto {
  id: number;
  friend_user_id: number;
  kakao_uuid: string;
  kakao_friend_name: string;
  friend_profile_img: string;
  created_at: Date;
  updated_at: Date;

  constructor(friend: Friend) {
    this.id = friend.id;
    this.friend_user_id = friend.friend_user.id;
    this.friend_profile_img = friend.friend_user.profile_img;
    this.kakao_uuid = friend.kakao_uuid;
    this.kakao_friend_name = friend.kakao_friend_name;
    this.created_at = friend.created_at;
    this.updated_at = friend.updated_at;
  }
}
