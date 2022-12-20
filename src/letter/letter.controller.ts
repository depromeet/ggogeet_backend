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

@Controller('letters')
export class LetterController {
  constructor(
    private readonly letterService: LetterService,
    private readonly authService: AuthService,
  ) {}

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

    // TODO: 카카오톡 보내기

    // 메세지 api 사용 위한 access token 요청
    // 테스트 시 code는 auth/code/friends로 받아와서 요청
    const codeResponse = await this.authService.getKakaoAccessToken(
      createSendLetterDto.kakaoAccessCode,
      CallbackType.FRIEND,
    );

    // 메세지 보내기 (친구 uuid)
    await this.authService.sendMessageToUser(
      codeResponse.accessToken,
      createSendLetterDto.kakaoUuid,
    );

    res.send(sendLetter);
  }

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

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.letterService.findOne(+id);
  }

  @Post('/texts')
  @HttpCode(HttpStatus.CREATED)
  createExternalLetter(
    @Body() createExternalLetterDto: CreateExternalLetterDto,
  ) {
    return this.letterService.createExternalLetter(createExternalLetterDto);
  }

  @Post('/images/upload')
  @UseInterceptors(FileInterceptor('file'))
  createExternalImgLetter(@UploadedFile() file: Express.MulterS3.File) {
    return this.letterService.uploadExternalLetterImage(file);
  }

  @Post('/images')
  @HttpCode(HttpStatus.CREATED)
  createExternalLetterImage(
    @Body() createExternalImgLetterDto: CreateExternalImgLetterDto,
  ) {
    return this.letterService.createExternalImgLetter(
      createExternalImgLetterDto,
    );
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.letterService.delete(id);
  }
}
