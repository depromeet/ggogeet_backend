import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReqUser } from 'src/common/decorators/user.decorators';
import { JwtAuthGuard } from 'src/common/guards/jwtAuth.guard';
import { User } from 'src/domain/users/entities/user.entity';
import { LetterService } from './letter.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateDraftLetterDto } from './dto/requests/createDraftLetter.request.dto';
import { KakaoMessageCallbackDto } from './dto/requests/kakaoCallback.request.dto';

@Controller('letters')
export class LetterController {
  constructor(private readonly letterService: LetterService) {}

  @ApiTags('Letter API')
  @ApiOperation({
    summary: '편지 생성 API',
    description:
      '신규 편지를 생성합니다, 편지를 보내기 위해서는 Complete API를 호출해주세요.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/draft')
  @HttpCode(HttpStatus.CREATED)
  async createDraftLetter(
    @ReqUser() user: User,
    @Body() createSendLetterDto: CreateDraftLetterDto,
  ) {
    const result = await this.letterService.createDraftLetter(
      user,
      createSendLetterDto,
    );
    return { data: result };
  }

  @ApiTags('Letter API')
  @ApiOperation({
    summary: '편지 전송 API',
    description: '편지를 친구에게 보냅니다.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/complete')
  @HttpCode(HttpStatus.CREATED)
  async sendLetter(@ReqUser() user: User, @Param('id') id: number) {
    const letter = await this.letterService.sendLetter(user, id);
    return { data: letter };
  }

  @ApiTags('Letter API')
  @ApiOperation({
    summary: '편지 외부 전송 API',
    description: '편지를 친구가 아닌 외부에 보냅니다.',
  })
  @ApiResponse({
    status: 201,
    description: '임시 편지가 성공적으로 생성되었습니다.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post(':id/temp-complete')
  @HttpCode(HttpStatus.CREATED)
  async sendTempLetter(@ReqUser() user: User, @Param('id') id: number) {
    return this.letterService.sendTempLetter(user, id);
  }

  @ApiTags('Letter API')
  @ApiOperation({
    summary: '편지 외부 전송 콜백 API',
    description: '카카오로 전송된 편지의 Callback을 받습니다.',
  })
  @Get('/temp-complete/kakao/callback')
  @HttpCode(HttpStatus.CREATED)
  async getKaKaoTempLetterCallback(@Query() query: KakaoMessageCallbackDto) {
    return this.letterService.getKaKaoTempLetterCallback(query);
  }

  @ApiTags('Letter API')
  @ApiOperation({
    summary: '편지 외부 전송 콜백 확인 API',
    description: '카카오로 전송된 편지의 Callback을 확인합니다.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get(':id/temp-complete/kakao/callback/confirm')
  async getKaKaoTempLetterCallbackCheck(@Param('id') id: number) {
    return this.letterService.getKaKaoTempLetterCallbackCheck(id);
  }
}
