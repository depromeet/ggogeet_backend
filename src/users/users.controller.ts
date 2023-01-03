import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/common/guards/jwtAuth.guard';
import { AuthService } from 'src/auth/auth.service';
import { ReqUser } from 'src/common/decorators/user.decorators';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UpdateUserDto } from './dto/requests/updateUser.dto';
import { User } from './entities/user.entity';
import { UserResponseDto } from './dto/response/user.response.dto';
import { ResponseFriendDto } from 'src/auth/dto/response/responseFriend.dto';

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
    summary: '유저 목록 가져오기 API',
    description: '유저 목록을 가져옵니다.',
  })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({
    summary: '내 정보 조회 API',
    description: '내 정보를 가져옵니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '내 정보를 반환합니다.',
    type: UserResponseDto,
  })
  @Get('/me')
  async findMe(@ReqUser() user: User) {
    return this.usersService.findUserById(user);
  }

  @ApiOperation({
    summary: '카카오 친구목록 가져오기 API',
    description: '카카오 친구목록을 가져옵니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '친구목록을 반환합니다.',
    type: [ResponseFriendDto],
  })
  @Get('/friends')
  async getFriends(@ReqUser() user: User) {
    return await this.authService.getKakaoFriends(user);
  }

  @ApiOperation({
    summary: '카카오 친구 정보 가져오기 API',
    description: '카카오 친구 정보를 친구 관계 ID로 가져옵니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '친구 정보를 반환합니다.',
    type: ResponseFriendDto,
  })
  @Get('/friends/:id')
  async getFriend(@ReqUser() user: User, @Param('id') id) {
    return this.authService.getKakaoFriendById(id, user);
  }

  @ApiOperation({
    summary: '유저 정보 수정 API',
    description: '유저 정보를 수정합니다.',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }
}
