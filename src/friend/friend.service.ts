import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseFriendDto } from './dto/response/responseFriend.dto';
import { User } from 'src/users/entities/user.entity';
import { Friend } from './entities/friend.entity';
import { Repository } from 'typeorm';
import { KakaoTokenRepository } from 'src/kakao/kakaoToken.memory.repository';
import { KakaoToken } from 'src/kakao/kakaoToken';
import { KakaoService } from 'src/kakao/kakao.service';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly kakaoService: KakaoService,
    private readonly kakaoTokenRepository: KakaoTokenRepository,
  ) {}

  async findAll(user: User): Promise<any> {
    const friendList = await this.friendRepository
      .createQueryBuilder('friend')
      .leftJoinAndSelect('friend.friendUser', 'user')
      .where('friend.userId = :userId', { userId: user.id })
      .getMany();
    const result = friendList.map((friend) => {
      return new ResponseFriendDto(friend);
    });
    return {
      data: result,
    };
  }

  async findOne(id: number, user: User): Promise<ResponseFriendDto> {
    const friend = await this.friendRepository
      .createQueryBuilder('friend')
      .leftJoinAndSelect('friend.friendUser', 'user')
      .where('friend.id = :id', { id: id })
      .andWhere('friend.userId = :userId', { userId: user.id })
      .getOne();

    if (!friend) {
      throw new NotFoundException({
        type: 'NOT_FOUND',
        message: `Friend #${id} not found`,
      });
    }

    return new ResponseFriendDto(friend);
  }

  async updateFriends(user: User) {
    const kakaoToken: KakaoToken = await this.kakaoTokenRepository.findByUserId(
      user.id,
    );
    const acessToken = kakaoToken.getAcessToken();

    if (!acessToken) {
      throw new NotFoundException({
        type: 'NOT_FOUND',
        message: `카카오 토큰이 없습니다.`,
      });
    }

    const [friendsList, friendsCount] =
      await this.kakaoService.getKakaoFriendsandCount(acessToken);
    if (friendsCount <= 0) {
      throw new NotFoundException({
        type: 'NOT_FOUND',
        message: `카카오 친구가 없습니다.`,
      });
    }

    for await (const element of friendsList) {
      const exFriend = await this.friendRepository.findOne({
        where: { userId: user.id, kakaoUuid: element.uuid },
      });
      if (!exFriend) {
        await this.createKakaoFriends(element, user);
      } else if (exFriend.kakaoFriendName != element.profile_nickname) {
        exFriend.kakaoFriendName = element.profile_nickname;
        await this.friendRepository.save(exFriend);
      }
    }
  }

  async createKakaoFriends(element, user: User) {
    const friend = new Friend();
    friend.kakaoUuid = element.uuid;
    friend.kakaoFriendName = element.profile_nickname;

    friend.friendUser = await this.findUserByClientId(element.id);
    friend.user = user;

    await this.friendRepository.save(friend);
  }

  async findUserByClientId(clientId: string): Promise<User> {
    const socialUser = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.social', 'social')
      .where('social.clientId = :clientId', { clientId: clientId })
      .getOne();

    return socialUser;
  }
}
