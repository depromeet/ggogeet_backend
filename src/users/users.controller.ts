import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
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
import { CreateKakaoUserDto } from 'src/auth/dto/requests/createKakaoUser.dto';
import { ReqUser } from 'src/common/decorators/user.decorators';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
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

  // TODO : "meta" : ~~, "data" : [ {},{}...] 형태로 swagger 설정 어떻게?

  @ApiOperation({
    summary: '유저 목록 가져오기 API',
    description: '유저 목록을 가져옵니다.',
  })
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @ApiOperation({
    summary: '유저 정보 수정 API',
    description: '유저 정보를 수정합니다.',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
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
  async findMe(@ReqUser() user: User, @Res() res) {
    res.send({ data: await this.usersService.findUserById(user.id) });
  }

  @ApiOperation({
    summary: '유저 조회 API',
    description: '유저 정보를 가져옵니다. ',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '유저 정보를 반환합니다.',
    type: UserResponseDto,
  })
  @Get(':id')
  async findOne(@Param('id') id: number, @Res() res) {
    res.send({ data: await this.usersService.findUserById(+id) });
  }

  // TODO: 유저 정보 삭제 로직

  // @ApiOperation({
  //   summary: '유저 삭제 API',
  //   description: '유저를 삭제합니다.',
  // })
  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.usersService.remove(+id);
  // }

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
  async getFriends(@ReqUser() user, @Res() res) {
    res.send({
      data: { friends: await this.authService.getKakaoFriends(user) },
    });
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
  async getFriend(@ReqUser() user, @Param('id') id, @Res() res) {
    res.send({
      data: await this.authService.getKakaoFriendById(id, user),
    });
  }
}
