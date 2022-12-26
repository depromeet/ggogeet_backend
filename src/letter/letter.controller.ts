import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AuthService } from 'src/auth/auth.service';
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

@Controller('letters')
@ApiTags('Letter API')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class LetterController {
  constructor(
    private readonly letterService: LetterService,
    private readonly authService: AuthService,
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
    return this.letterService.getSendLetters(user.id, page);
  }

  @ApiOperation({
    summary: '보낸 편지 상세 조회 API',
    description: '보낸 편지를 상세 조회합니다.',
  })
  @Get('/sent/:id')
  async getSentLetter(@Param('id') id: number) {
    //todo
  }

  @ApiOperation({
    summary: '보낸 편지 삭제하기 API',
    description: '보낸 편지를 삭제합니다.',
  })
  @Delete('/sent/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSentLetter() {
    //todo
  }

  @ApiOperation({
    summary: '받은 편지함 조회 API',
    description: '유저가 받은 편지함 조회을 조회합니다.',
  })
  @Get('/received')
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
    summary: '받은 편지 상세 조회 API',
    description: '편지 상세 조회를 조회합니다.',
  })
  @Get('/received/:id')
  findOne(@Param('id') id: number) {
    return this.letterService.findOne(+id);
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
    return this.letterService.uploadExternalLetterImage(file);
  }

  @ApiOperation({
    summary: '받은 편지 삭제 API',
    description: '받은 편지를 삭제합니다.',
  })
  @Delete('/recevied/:id')
  delete(@Param('id') id: number) {
    return this.letterService.delete(id);
  }
}
