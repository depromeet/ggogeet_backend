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
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateDraftLetterDto } from './dto/requests/createDraftLetter.request.dto';
import { LetterSentService } from './letter.sent.service';
import { LetterReceivedService } from './letter.received.service';
import { CreateExternalImgLetterDto } from './dto/requests/createExternalLetterImg.request.dto';
import { CreateExternalTextLetterDto } from './dto/requests/createExternalLetter.request.dto';

@Controller('letters')
@ApiTags('Letter API')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LetterController {
  constructor(
    private readonly letterService: LetterService,
    private readonly letterSentService: LetterSentService,
    private readonly letterReceivedService: LetterReceivedService,
  ) {}

  @ApiOperation({
    summary: '편지 생성 API',
    description:
      '신규 편지를 생성합니다, 편지를 보내기 위해서는 Complete API를 호출해주세요.',
  })
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

  @ApiOperation({
    summary: '편지 전송 API',
    description: '편지를 친구에게 보냅니다.',
  })
  @Post(':id/complete')
  @HttpCode(HttpStatus.CREATED)
  async sendLetter(@ReqUser() user: User, @Param('id') id: number) {
    const letter = await this.letterService.sendLetter(user, id);
    return { data: letter };
  }

  @ApiOperation({
    summary: '보낸 편지함 조회 API',
    description: '보낸 편지를 조회합니다.',
  })
  @Get('/sent')
  @HttpCode(HttpStatus.OK)
  async getSendLetter(@ReqUser() user: User, @Query('sort') sort: string) {
    const sentLetters = this.letterSentService.findAll(user, sort);
    return { data: sentLetters };
  }

  @ApiOperation({
    summary: '보낸 편지 상세 조회 API',
    description: '보낸 편지를 상세 조회합니다.',
  })
  @Get('/sent/:id')
  async getSentLetter(@ReqUser() user: User, @Param('id') id: number) {
    const sentLetter = await this.letterSentService.findOne(user, id);
    return { data: sentLetter };
  }

  @ApiOperation({
    summary: '보낸 편지 삭제하기 API',
    description: '보낸 편지를 삭제합니다.',
  })
  @Delete('/sent/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteSentLetter(@ReqUser() user: User, @Param('id') id: number) {
    return this.letterSentService.delete(user, id);
  }

  @ApiOperation({
    summary: '받은 편지함 조회 API',
    description: '유저가 받은 편지함 조회을 조회합니다.',
  })
  @Get('/received')
  async findAll(
    @ReqUser() user: User,
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
    const receviedLetters = await this.letterReceivedService.findAll(
      user,
      query,
    );
    return { data: receviedLetters };
  }

  @ApiOperation({
    summary: '받은 편지 상세 조회 API',
    description: '편지 상세 조회를 조회합니다.',
  })
  @Get('/received/:id')
  async findOne(@ReqUser() user: User, @Param('id') id: number) {
    const receivedLetter = await this.letterReceivedService.findOne(user, id);
    return { data: receivedLetter };
  }

  @ApiOperation({
    summary: '이미지 편지 업로드 API',
    description: '외부에서 받은 이미지로 된 편지를 업로드합니다.',
  })
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

  @ApiOperation({
    summary: '외부 텍스트 편지 생성 API',
    description: '외부에서 받은 텍스트로 된 편지를 생성합니다.',
  })
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

  @ApiOperation({
    summary: '외부 이미지 편지 생성 API',
    description: '외부에서 받은 이미지로 된 편지를 생성합니다.',
  })
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

  @ApiOperation({
    summary: '받은 편지 삭제 API',
    description: '받은 편지를 삭제합니다.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/received/:id')
  delete(@Param('id') id: number) {
    return this.letterReceivedService.delete(id);
  }
}
