import {
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { JwtAuthGuard } from 'src/common/guards/jwtAuth.guard';
import { ReqUser } from 'src/common/decorators/user.decorators';
import { User } from 'src/users/entities/user.entity';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseFriendDto } from './dto/response/responseFriend.dto';

@Controller('friends')
@ApiBearerAuth()
@ApiTags('Friends API')
@UseGuards(JwtAuthGuard)
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @ApiOperation({
    summary: '카카오 친구목록 가져오기 API',
    description: '카카오 친구목록을 가져옵니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '친구목록을 반환합니다.',
    type: [ResponseFriendDto],
  })
  @Get()
  findAll(@ReqUser() user: User) {
    return this.friendService.findAll(user);
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
  @Get('/:id')
  findOne(@ReqUser() user: User, @Param('id') id: number) {
    return this.friendService.findOne(id, user);
  }
}
