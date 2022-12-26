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
import { JwtAuthGuard } from 'src/common/guards/jwtAuth.guard';
import { CreateSentenceDto } from './dto/createSentence.dto';
import { SentenceService } from './sentence.service';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SentenceResponseDto } from './dto/sentence.response.dto';
import { User } from 'src/users/entities/user.entity';
import { ReqUser } from 'src/common/decorators/user.decorators';

@Controller('sentence')
@ApiTags('Sentence API')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SentenceController {
  constructor(private readonly sentenceService: SentenceService) {}

  @ApiOperation({
    summary: '모든 문장 가져오기 API',
    description: '상황별의 모든 문장을 가져옵니다.',
  })
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

  @ApiOperation({
    summary: '내가 쓴 문장 가져오기 API',
    description: '내가 쓴 문장을 가져옵니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '내가 쓴 문장을 가져옵니다.',
    type: SentenceResponseDto,
  })
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

  @ApiOperation({
    summary: '문장 삭제하기 API',
    description: '문장을 삭제합니다.',
  })
  @Delete(':id')
  async deleteSentence(@ReqUser() user: User, @Param('id') id: number) {
    return await this.sentenceService.deleteSentence(id, user);
  }
}
