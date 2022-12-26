import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ReqUser } from 'src/common/decorators/user.decorators';
import { JwtAuthGuard } from 'src/common/guards/jwtAuth.guard';
import { User } from 'src/users/entities/user.entity';
import { CreateReplyDto } from './dtos/requests/createReply.request.dto';
import { ReplyService } from './reply.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('replies')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('Reply API')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: '답장 생성 API',
    description: '다른 사용자의 글에 답장을 답니다.',
  })
  async create(@Body() replyDto: CreateReplyDto, @ReqUser() user: User) {
    return await this.replyService.createReply(replyDto, user);
  }
}
