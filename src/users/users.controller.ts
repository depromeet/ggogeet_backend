import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/common/guards/jwtAuth.guard';
import { AuthService } from 'src/auth/auth.service';
import { ReqUser } from 'src/common/decorators/user.decorators';
import { User } from './entities/user.entity';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // 내 친구목록 가져오기
  @Get('/friends')
  async getFriends(@ReqUser() user: User, @Res() res) {
    res.send({
      data: { friends: await this.authService.getKakaoFriends(user) },
    });
  }

  @Get('/friends/:id')
  async getFriend(@ReqUser() user: User, @Param('id') id, @Res() res) {
    res.send({
      data: await this.authService.getKakaoFriendById(id, user),
    });
  }

  @Get('/me')
  async findMe(@ReqUser() user: User, @Res() res) {
    res.send({ data: await this.usersService.findUserById(user.id) });
  }

  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res) {
    res.send({ data: await this.usersService.findUserById(+id) });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  // @Patch('/me')
  // updateAlert(@ReqUser() user: User, @Body() body) {
  //   const updateUser = await this.usersService.update(user.id, body);
  // }
}
