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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ReqUser } from 'src/common/decorators/user.decorators';
import { JwtAuthGuard } from 'src/common/guards/jwtAuth.guard';
import { User } from 'src/users/entities/user.entity';
import { LetterService } from './letter.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateDraftLetterDto } from './dto/requests/createDraftLetter.request.dto';
import { LetterSentService } from './letter.sent.service';
import { LetterReceivedService } from './letter.received.service';
import { CreateExternalImgLetterDto } from './dto/requests/createExternalLetterImg.request.dto';
import { CreateExternalTextLetterDto } from './dto/requests/createExternalLetter.request.dto';
import {
  ApiPaginationRequst,
  ApiPaginationResponse,
} from 'src/common/paginations/pagination.swagger';
import {
  findAllReceviedLetterDto,
  findAllSentLetterDto,
} from './dto/requests/findAllLetter.request.dto';
import { SendLetter } from './entities/sendLetter.entity';
import { ReceivedLetter } from './entities/receivedLetter.entity';
import { KakaoMessageCallbackDto } from './dto/requests/kakaoCallback.request.dto';
import {
  ReceivedLetterDetailResponseDto,
  SendLetterDetailResponseDto,
  tempLetterResponseDto,
} from './dto/responses/letterDetail.response.dto';
import {
  ReceviedAllResponseDto,
  SendAllResponseDto,
} from './dto/responses/letterStorage.response.dto';

@Controller('letters')
export class LetterController {
  constructor(
    private readonly letterService: LetterService,
    private readonly letterSentService: LetterSentService,
    private readonly letterReceivedService: LetterReceivedService,
  ) {}

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
  async getKaKaoTempLetterCallbackCheck(
    @ReqUser() user: User,
    @Param('id') id: number,
  ) {
    return this.letterService.getKaKaoTempLetterCallbackCheck(id);
  }
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
  @Get('/sent')
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
  @Get('/sent/:id')
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
  @Delete('/sent/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteSentLetter(@ReqUser() user: User, @Param('id') id: number) {
    return this.letterSentService.delete(user, id);
  }

  @ApiTags('Received Letter API')
  @ApiOperation({
    summary: '받은 편지함 조회 API',
    description: '유저가 받은 편지함 조회을 조회합니다.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiPaginationRequst()
  @ApiPaginationResponse(ReceviedAllResponseDto)
  @HttpCode(HttpStatus.OK)
  @Get('/received')
  async findAll(
    @ReqUser() user: User,
    @Query()
    query: findAllReceviedLetterDto,
  ) {
    return await this.letterReceivedService.findAll(user, query);
  }

  @ApiTags('Received Letter API')
  @ApiOperation({
    summary: '받은 편지 상세 조회 API',
    description: '편지 상세 조회를 조회합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '받은 편지',
    type: ReceivedLetterDetailResponseDto,
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('/received/:id')
  async findOne(@ReqUser() user: User, @Param('id') id: number) {
    const receivedLetter = await this.letterReceivedService.findOne(user, id);
    return { data: receivedLetter };
  }

  @ApiTags('Received Letter API')
  @ApiOperation({
    summary: '임시로 받은 편지 조회 API',
    description: '임시로 받은 편지를 조회합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '임시로 받은 편지 조회',
    type: tempLetterResponseDto,
  })
  @ApiNotFoundResponse({
    status: HttpStatus.NOT_FOUND,
    description: '임시로 받은 편지가 없습니다.',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '잘못된 요청입니다.',
  })
  @Get('/received/temp/:id')
  async findOneTemp(@Param('id') id: number) {
    const tempReceivedLetter = await this.letterReceivedService.findOneTemp(id);
    return { data: tempReceivedLetter };
  }

  @ApiTags('Received Letter API')
  @ApiOperation({
    summary: '이미지 편지 업로드 API',
    description: '외부에서 받은 이미지로 된 편지를 업로드합니다.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '이미지 편지 업로드 성공',
  })
  @Post('/received/images/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExternalImgLetter(@UploadedFile() file: Express.MulterS3.File) {
    const letter = await this.letterReceivedService.uploadExternalLetterImage(
      file,
    );
    return { data: letter };
  }

  @ApiTags('Received Letter API')
  @ApiOperation({
    summary: '외부 텍스트 편지 생성 API',
    description: '외부에서 받은 텍스트로 된 편지를 생성합니다.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/received/texts')
  @HttpCode(HttpStatus.CREATED)
  async createExternalTextLetter(
    @ReqUser() user: User,
    @Body() createExternalTextLetterDto: CreateExternalTextLetterDto,
  ) {
    const letter = await this.letterReceivedService.createTextLetter(
      user,
      createExternalTextLetterDto,
    );
    return { data: letter };
  }

  @ApiTags('Received Letter API')
  @ApiOperation({
    summary: '외부 이미지 편지 생성 API',
    description: '외부에서 받은 이미지로 된 편지를 생성합니다.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/received/images')
  @HttpCode(HttpStatus.CREATED)
  async createExternalImageLetter(
    @ReqUser() user: User,
    @Body() createExternalImgLetterDto: CreateExternalImgLetterDto,
  ) {
    const letter = await this.letterReceivedService.createImageLetter(
      user,
      createExternalImgLetterDto,
    );
    return { data: letter };
  }

  @ApiTags('Received Letter API')
  @ApiOperation({
    summary: '받은 편지 삭제 API',
    description: '받은 편지를 삭제합니다.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/received/:id')
  delete(@Param('id') id: number) {
    return this.letterReceivedService.delete(id);
  }
}
