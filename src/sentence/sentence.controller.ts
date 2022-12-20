import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateSentenceDto } from './dto/requests/create-sentence.request.dto';
import { SentenceService } from './sentence.service';
import { ReqUser } from 'src/common/decorators/user.decorators';
import { User } from 'src/users/entities/user.entity';

@Controller('sentence')
@UseGuards(JwtAuthGuard)
export class SentenceController {
  constructor(private readonly sentenceService: SentenceService) {}

  @Get()
  async findAllSentence(
    @ReqUser() user: User,
    @Query()
    query: {
      situation: number;
      order: string;
    },
  ) {
    return await this.sentenceService.findAll(user, query);
  }

  @Get(':id')
  async findOneSentence(@ReqUser() user: User, @Param('id') id: number) {
    return await this.sentenceService.findOne(user, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSentence(
    @ReqUser() user: User,
    @Body() sentenceDto: CreateSentenceDto,
  ) {
    return await this.sentenceService.createSentence(user, sentenceDto);
  }

  @Delete(':id')
  async deleteSentence(@ReqUser() user: User, @Param('id') id: number) {
    return await this.sentenceService.deleteSentence(id, user);
  }
}
