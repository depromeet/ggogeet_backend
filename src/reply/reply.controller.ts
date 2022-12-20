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
  
  @Controller('replies')
  @UseGuards(JwtAuthGuard)
  export class ReplyController {
    constructor(private readonly replyService: ReplyService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() replyDto: CreateReplyDto, @ReqUser() user: User) {
        return await this.replyService.createReply(replyDto, user);
    }
  }
  