import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import axios from 'axios';
import { AuthService } from 'src/auth/auth.service';
import { ReqUser } from 'src/common/decorators/user.decorators';
import { JwtAuthGuard } from 'src/common/guards/jwtAuth.guard';
import { CallbackType } from 'src/constants/kakaoCallback.constant';
import { User } from 'src/users/entities/user.entity';
import { CreateExternalImgLetterDto } from './dto/requests/createExternalLetterImg.request.dto';
import { CreateExternalLetterDto } from './dto/requests/createExternalLetter.request.dto';
import { CreateSendLetterDto } from './dto/requests/createSendLetter.request.dto';
import { LetterService } from './letter.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('letters')
@ApiTags('Letter API')
export class LetterController {
  constructor(
    private readonly letterService: LetterService,
    private readonly authService: AuthService,
  ) {}

  @ApiOperation({
    summary: '편지를 보내는 API',
    description: '편지를 친구에게 보냅니다.',
  })
  @ApiBearerAuth()
  @Post('/send')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createSendLetter(
    @ReqUser() user: User,
    @Res() res,
    @Body() createSendLetterDto: CreateSendLetterDto,
  ) {
    const letterData = {
      userId: user.id,
      ...createSendLetterDto,
    };
    const sendLetter = await this.letterService.createSendLetter(letterData);

    // 메세지 api 사용 위한 access token 요청
    // 테스트 시 code는 auth/code/friends로 받아와서 요청
    if (createSendLetterDto.kakaoAccessCode && createSendLetterDto.kakaoUuid) {
      const codeResponse = await this.authService.getKakaoAccessToken(
        createSendLetterDto.kakaoAccessCode,
        CallbackType.FRIEND,
      );

      // 메세지 보내기 (친구 uuid)
      await this.authService.sendMessageToUser(
        codeResponse.access_token,
        createSendLetterDto.kakaoUuid,
      );
    }

    res.send({
      data: { sendLetter },
    });
  }

  @ApiOperation({
    summary: '보낸 편지 조회하기 API',
    description: '보낸 편지를 조회합니다.',
  })
  @ApiBearerAuth()
  @Get('/send')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  async getSendLetter(
    @ReqUser() user: User,
    // @Req() req, // #TODO pagination DTO 로 변경
    @Res() res,
    @Query('page', ParseIntPipe) page: number,
  ) {
    const sendLettersAndMeta = await this.letterService.getSendLetters(
      user.id,
      page,
    );

    res.send({
      meta: sendLettersAndMeta.meta,
      data: { sendLetters: sendLettersAndMeta.sendLetters },
    });
  }

  @ApiOperation({
    summary: '받은 편지함 조회 API',
    description: '유저가 받은 편지함 조회을 조회합니다.',
  })
  @Get()
  findAll(
    @Query()
    query: {
      offset: number;
      limit: number;
      order: string;
      fromDate: string;
      toDate: string;
      sender: string;
    },
  ) {
    return this.letterService.findAll(query);
  }

  @ApiOperation({
    summary: '편지 상세 조회 API',
    description: '편지 상세 조회를 조회합니다.',
  })
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.letterService.findOne(+id);
  }

  // @Post('/texts')
  // @HttpCode(HttpStatus.CREATED)
  // createExternalLetter(
  //   @Body() createExternalLetterDto: CreateExternalLetterDto,
  // ) {
  //   return this.letterService.createExternalLetter(createExternalLetterDto);
  // }

  @ApiOperation({
    summary: '이미지 편지 업로드 API',
    description: '외부에서 받은 이미지로 된 편지를 업로드합니다.',
  })
  @ApiBearerAuth()
  @Post('/images/upload')
  @UseInterceptors(FileInterceptor('file'))
  createExternalImgLetter(@UploadedFile() file: Express.MulterS3.File) {
    return this.letterService.uploadExternalLetterImage(file);
  }

  // @Post('/images')
  // @HttpCode(HttpStatus.CREATED)
  // createExternalLetterImage(
  //   @Body() createExternalImgLetterDto: CreateExternalImgLetterDto,
  // ) {
  //   return this.letterService.createExternalImgLetter(
  //     createExternalImgLetterDto,
  //   );
  // }

  @ApiOperation({
    summary: '편지 삭제 API',
    description: '편지를 삭제합니다.',
  })
  @ApiBearerAuth()
  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.letterService.delete(id);
  }
}
