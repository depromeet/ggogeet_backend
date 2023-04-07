import { LetterSentService } from './letter.sent.service';
import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  ApiPaginationRequst,
  ApiPaginationResponse,
} from '../../common/paginations/pagination.swagger';
import { SendAllResponseDto } from './dto/responses/letterStorage.response.dto';
import { JwtAuthGuard } from '../../common/guards/jwtAuth.guard';
import { ReqUser } from '../../common/decorators/user.decorators';
import { User } from '../users/entities/user.entity';
import { findAllSentLetterDto } from './dto/requests/findAllLetter.request.dto';
import { SendLetterDetailResponseDto } from './dto/responses/letterDetail.response.dto';

@Controller('letters/sent')
export class LetterSentController {
  constructor(private readonly letterSentService: LetterSentService) {}

  @ApiTags('Sent Letter API')
  @ApiOperation({
    summary: '보낸 편지함 조회 API',
    description: '보낸 편지를 조회합니다.',
  })
  @ApiPaginationRequst()
  @ApiPaginationResponse(SendAllResponseDto)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @Get()
  async getSendLetter(
    @ReqUser() user: User,
    @Query() query: findAllSentLetterDto,
  ) {
    return this.letterSentService.findAll(user, query);
  }

  @ApiTags('Sent Letter API')
  @ApiOperation({
    summary: '보낸 편지 상세 조회 API',
    description: '보낸 편지를 상세 조회합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '보낸 편지',
    type: SendLetterDetailResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/:id')
  async getSentLetter(@ReqUser() user: User, @Param('id') id: number) {
    const sentLetter = await this.letterSentService.findOne(user, id);
    return { data: sentLetter };
  }

  @ApiTags('Sent Letter API')
  @ApiOperation({
    summary: '보낸 편지 삭제하기 API',
    description: '보낸 편지를 삭제합니다.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteSentLetter(@ReqUser() user: User, @Param('id') id: number) {
    return this.letterSentService.delete(user, id);
  }
}
