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
import { UpdateUserDto } from './dto/requests/update-user.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { AuthService } from 'src/auth/auth.service';
import { CreateKakaoUserDto } from 'src/auth/dto/requests/create-kakaouser.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateKakaoUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  // 내 친구목록 가져오기
  @Get('/friends')
  async getFriends(@Req() req, @Res() res) {
    const friendsList = await this.authService.getKakaoFriends(req.user);
    return res.send(friendsList);
  }

  @Get('/friends/:id')
  async getFriend(@Req() req, @Param('id') id, @Res() res) {
    return res.send(await this.authService.getKakaoFriendById(id, req.user));
  }
}
