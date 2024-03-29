import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwtAuth.guard';
import { CreateSentenceDto } from './dto/requests/createSentence.request.dto';
import { SentenceService } from './sentence.service';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { SentenceResponseDto } from './dto/responses/sentence.response.dto';
import { ReqUser } from 'src/common/decorators/user.decorators';
import { User } from 'src/domain/users/entities/user.entity';
import { SituationSentenceResponseDto } from './dto/responses/manysentence.response.dto';

@Controller('sentence')
@ApiTags('Sentence API')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class SentenceController {
  constructor(private readonly sentenceService: SentenceService) {}

  @ApiOperation({
    summary: '상황별 문장 가져오기 API',
    description: '상황 id로 사용자 추가 문장, 가이드 문장을 가져옵니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '상황 id로 사용자 추가 문장, 가이드 문장을 가져옵니다.',
    type: SituationSentenceResponseDto,
  })
  @Get('situation/:id')
  async findSentence(@ReqUser() user: User, @Param('id') situationId: number) {
    const userSentence = await this.sentenceService.findUserSentenceBySituation(
      user.id,
      situationId,
    );
    const guideSentence =
      await this.sentenceService.findGuideSentenceBySituation(situationId);

    return { data: { userSentence, guideSentence } };
  }

  @ApiOperation({
    summary: '문장 추가하기 API',
    description: '문장을 추가합니다.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '문장이 추가되었습니다.',
    type: SentenceResponseDto,
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSentence(
    @ReqUser() user: User,
    @Body() sentenceDto: CreateSentenceDto,
  ) {
    const sentence = await this.sentenceService.createSentence(
      user,
      sentenceDto,
    );
    return { data: sentence };
  }

  @ApiOperation({
    summary: '내가 쓴 문장 가져오기 API',
    description: '내가 쓴 문장을 가져옵니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '내가 쓴 문장을 문장 id로 가져옵니다',
    type: SentenceResponseDto,
  })
  @Get(':id')
  async findOneSentence(@ReqUser() user: User, @Param('id') id: number) {
    const sentence = await this.sentenceService.findOne(user, id);
    return { data: sentence };
  }

  @ApiOperation({
    summary: '문장 삭제하기 API',
    description: '문장을 삭제합니다.',
  })
  @ApiNotFoundResponse({ description: '문장을 찾을 수 없습니다.' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '문장이 삭제되었습니다.',
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSentence(@ReqUser() user: User, @Param('id') id: number) {
    return await this.sentenceService.deleteSentence(id, user);
  }
}
