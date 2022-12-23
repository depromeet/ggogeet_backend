import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateKakaoUserDto } from 'src/auth/dto/requests/createKakaoUser.dto';
import { Repository } from 'typeorm';
import { UserResponseDto } from './dto/response/user.response.dto';
import { Social } from './entities/social.entity';
import { User } from './entities/user.entity';
import { UserInfo } from './entities/userinfo.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Social) private socialRepository: Repository<Social>,
    @InjectRepository(UserInfo)
    private userInfoRepository: Repository<UserInfo>,
  ) {}

  async findUserById(id) {
    const user = await this.userRepository.findOne({
      where: { id: id },
      relations: { userInfo: true, social: true },
      select: ['id', 'name', 'profileImg', 'social', 'userInfo'],
    });
    return new UserResponseDto(user);
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
