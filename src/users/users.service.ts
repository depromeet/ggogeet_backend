import { Injectable } from '@nestjs/common';
import { CreateKakaoUserDto } from 'src/auth/dto/requests/create-kakaouser.dto';
import { UpdateUserDto } from './dto/requests/update-user.dto';

@Injectable()
export class UsersService {
  create(createUserDto: CreateKakaoUserDto) {
    return 'This action adds a new user';
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
