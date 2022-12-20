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

@Controller('sentence')
@UseGuards(JwtAuthGuard)
export class SentenceController {
  constructor(private readonly sentenceService: SentenceService) {}

  // 상황별 모든 문장 가져오기
  @Get()
  async findAllSentence(@Req() req) {
    return await this.sentenceService.findAll(req.user);
  }

  // 내가 쓴 문장 id로 가져오기
  @Get(':id')
  async findOneSentence(@Req() req, @Param('id') id: number) {
    return await this.sentenceService.findOne(req.user, id);
  }

  // 엔드포인트 맘에 안듬
  // 상황별로 문장 가져오기 (예시+추가)
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

  // 문장 추가해서 반환
  @Post() // 관계태그, 공유할지말지, 문장 내용
  @HttpCode(HttpStatus.CREATED)
  async createSentence(@Req() req, @Body() sentenceDto: CreateSentenceDto) {
    return await this.sentenceService.createSentence(req.user, sentenceDto);
  }

  // 문장 삭제하기
  @Delete(':id') // 내가 추가한 문장 삭제
  async deleteSentence(@Req() req, @Param('id') id: number) {
    return await this.sentenceService.deleteSentence(id, req.user);
  }
}
