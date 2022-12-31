import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateKakaoUserDto } from 'src/auth/dto/requests/createKakaoUser.dto';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/requests/updateUser.dto';
import { UserResponseDto } from './dto/response/user.response.dto';
import { Social } from './entities/social.entity';
import { User } from './entities/user.entity';
import { UserInfo } from './entities/userInfo.entity';

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

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(`User #${id} not found`);
    }

    // TODO : add update user
    return await this.userRepository.save(user);
  }

  async findAll() {
    return await this.userRepository.find();
  }
}
