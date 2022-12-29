export class UserResponseDto {
  id: number;
  name: string;
  profileImg: string;
  remindOn: boolean;
  alertOn: boolean;
  welcomePopupView: boolean;
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
