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
  async findAll() {
    const users = await this.usersService.findAll();
    return { data: users };
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
    const me = await this.usersService.findUserByMe(user);
    return { data: me };
  }

  @ApiOperation({
    summary: '유저 정보 수정 API',
    description: '유저 정보를 수정합니다.',
  })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(+id, updateUserDto);
    return { data: user };
  }
}
