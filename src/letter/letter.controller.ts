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
import { LetterReceviedService } from './letter.recevied.service';

@Controller('letters')
@ApiTags('Letter API')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LetterController {
  constructor(
    private readonly letterService: LetterService,
    private readonly letterSentService: LetterSentService,
    private readonly letterReceviedService: LetterReceviedService,
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
    return this.letterService.createDraftLetter(user, createSendLetterDto);
  }

  @ApiOperation({
    summary: '편지 전송 API',
    description: '편지를 친구에게 보냅니다.',
  })
  @Post(':id/complete')
  @HttpCode(HttpStatus.CREATED)
  async sendLetter(@ReqUser() user: User, @Param('id') id: number) {
    return this.letterService.sendLetter(user, id);
  }

  @ApiOperation({
    summary: '보낸 편지함 조회 API',
    description: '보낸 편지를 조회합니다.',
  })
  @Get('/sent')
  @HttpCode(HttpStatus.OK)
  async getSendLetter(
    @ReqUser() user: User,
    @Query('page', ParseIntPipe) page: number,
  ) {
    return this.letterSentService.findAll(user, page);
  }

  @ApiOperation({
    summary: '보낸 편지 상세 조회 API',
    description: '보낸 편지를 상세 조회합니다.',
  })
  @Get('/sent/:id')
  async getSentLetter(@ReqUser() user: User, @Param('id') id: number) {
    return this.letterSentService.findOne(user, id);
  }

  @ApiOperation({
    summary: '보낸 편지 삭제하기 API',
    description: '보낸 편지를 삭제합니다.',
  })
  @Delete('/sent/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSentLetter(@ReqUser() user: User, @Param('id') id: number) {
    return this.letterSentService.delete(user, id);
  }

  @ApiOperation({
    summary: '받은 편지함 조회 API',
    description: '유저가 받은 편지함 조회을 조회합니다.',
  })
  @Get('/received')
  findAll(
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
    return this.letterReceviedService.findAll(user, query);
  }

  @ApiOperation({
    summary: '받은 편지 상세 조회 API',
    description: '편지 상세 조회를 조회합니다.',
  })
  @Get('/received/:id')
  findOne(@ReqUser() user: User, @Param('id') id: number) {
    return this.letterReceviedService.findOne(user, id);
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
  @Post('/recevied/images/upload')
  @UseInterceptors(FileInterceptor('file'))
  createExternalImgLetter(@UploadedFile() file: Express.MulterS3.File) {
    return this.letterReceviedService.uploadExternalLetterImage(file);
  }

  @ApiOperation({
    summary: '받은 편지 삭제 API',
    description: '받은 편지를 삭제합니다.',
  })
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/recevied/:id')
  delete(@Param('id') id: number) {
    return this.letterReceviedService.delete(id);
  }
}
