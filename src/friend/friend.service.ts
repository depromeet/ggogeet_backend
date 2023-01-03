import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseFriendDto } from './dto/response/responseFriend.dto';
import { User } from 'src/users/entities/user.entity';
import { Friend } from './entities/friend.entity';
import { Repository } from 'typeorm';

@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend)
    private readonly friendRepository: Repository<Friend>,
  ) {}

  async findAll(user: User): Promise<ResponseFriendDto[]> {
    const friendList = await this.friendRepository
      .createQueryBuilder('friend')
      .leftJoinAndSelect('friend.friendUser', 'user')
      .where('friend.userId = :userId', { userId: user.id })
      .getMany();
    return friendList.map((friend) => {
      return new ResponseFriendDto(friend);
    });
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
}
