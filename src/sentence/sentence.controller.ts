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
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/common/guards/jwtAuth.guard';
import { CreateSentenceDto } from './dto/createSentence.dto';
import { SentenceService } from './sentence.service';
import {
  ApiBearerAuth,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

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
  async findAllSentence(@Req() req) {
    return await this.sentenceService.findAll(req.user);
  }

  @ApiOperation({
    summary: '내가 쓴 문장 가져오기 API',
    description: '내가 쓴 문장을 가져옵니다.',
  })
  @Get(':id')
  async findOneSentence(@Req() req, @Param('id') id: number) {
    return await this.sentenceService.findOne(req.user, id);
  }

  @ApiOperation({
    summary: '상황별 문장 가져오기 API',
    description: '상황별로 문장을 가져옵니다.',
  })
  @Get('situation')
  async findSentence(@Req() req, @Query('id') situationId: number) {
    const userSentence = await this.sentenceService.findUserSentenceBySituation(
      req.user.id,
      situationId,
    );
    const guideSentence =
      await this.sentenceService.findGuideSentenceBySituation(situationId);

    return { userSentence, guideSentence };
  }

  @ApiOperation({
    summary: '문장 추가하기 API',
    description: '문장을 추가합니다.',
  })
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSentence(@Req() req, @Body() sentenceDto: CreateSentenceDto) {
    return await this.sentenceService.createSentence(req.user, sentenceDto);
  }

  @ApiOperation({
    summary: '문장 삭제하기 API',
    description: '문장을 삭제합니다.',
  })
  @ApiNotFoundResponse({ description: '문장을 찾을 수 없습니다.' })
  @Delete(':id')
  async deleteSentence(@Req() req, @Param('id') id: number) {
    return await this.sentenceService.deleteSentence(id, req.user);
  }
}
