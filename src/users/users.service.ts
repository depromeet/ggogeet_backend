import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserResponseDto } from './dto/response/user.response.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findUserByMe(user: User) {
    const userInfo = await this.userRepository.findOne({
      where: { id: user.id },
      relations: { userInfo: true, social: true },
      select: ['id', 'name', 'profileImg', 'social', 'userInfo'],
    });
    return new UserResponseDto(userInfo);
  }

  async update(id: number) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'This User is not available',
        error: 'Bad Request to this Id, This User is not available',
      });
    }

    // TODO : add update user
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }

  async findUserBySocialId(socialId: number): Promise<User> {
    const socialUser = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.social', 'social')
      .where('social.clientId = :clientId', { clientId: socialId })
      .getOne();
    if (!socialUser) {
      throw new NotFoundException({
        statusCode: 404,
        message: 'This kakao User is not available',
        error: 'Bad Request to this kakao Id, This kakao user is not available',
      });
    }

    return socialUser;
  }
}
