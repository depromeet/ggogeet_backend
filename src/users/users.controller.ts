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
import { UpdateUserDto } from './dto/requests/updateUser.dto';
import { JwtAuthGuard } from 'src/common/guards/jwtAuth.guard';
import { AuthService } from 'src/auth/auth.service';
import { CreateKakaoUserDto } from 'src/auth/dto/requests/createKakaoUser.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Users API')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary: '유저 생성 API',
    description: '유저를 생성합니다.',
  })
  @Post()
  create(@Body() createUserDto: CreateKakaoUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({
    summary: '유저 목록 가져오기 API',
    description: '유저 목록을 가져옵니다.',
  })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.usersService.findOne(+id);
  // }

  @ApiOperation({
    summary: '유저 정보 수정 API',
    description: '유저 정보를 수정합니다.',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @ApiOperation({
    summary: '유저 삭제 API',
    description: '유저를 삭제합니다.',
  })
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @ApiOperation({
    summary: '카카오 친구목록 가져오기 API',
    description: '카카오 친구목록을 가져옵니다.',
  })
  // 내 친구목록 가져오기
  @Get('/friends')
  async getFriends(@Req() req, @Res() res) {
    const friendsList = await this.authService.getKakaoFriends(req.user);
    return res.send(friendsList);
  }

  @ApiOperation({
    summary: '카카오 친구 정보 가져오기 API',
    description: '카카오 친구 정보를 가져옵니다.',
  })
  @Get('/friends/:id')
  async getFriend(@Req() req, @Param('id') id, @Res() res) {
    return res.send(await this.authService.getKakaoFriendById(id, req.user));
  }
}
