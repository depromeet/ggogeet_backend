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
import { LetterReceivedService } from './letter.received.service';
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
import {
  ReceivedLetterDetailResponseDto,
  tempLetterResponseDto,
} from './dto/responses/letterDetail.response.dto';
import { JwtAuthGuard } from '../../common/guards/jwtAuth.guard';
import { ReqUser } from '../../common/decorators/user.decorators';
import { User } from '../users/entities/user.entity';
import {
  ApiPaginationRequst,
  ApiPaginationResponse,
} from '../../common/paginations/pagination.swagger';
import { ReceviedAllResponseDto } from './dto/responses/letterStorage.response.dto';
import { findAllReceviedLetterDto } from './dto/requests/findAllLetter.request.dto';
import { CreateExternalTextLetterDto } from './dto/requests/createExternalLetter.request.dto';
import { CreateExternalImgLetterDto } from './dto/requests/createExternalLetterImg.request.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('letters/received')
export class LetterReceivedController {
  constructor(private readonly letterReceivedService: LetterReceivedService) {}
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
  @Get()
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
  @Get('/:id')
  async findOne(@ReqUser() user: User, @Param('id') id: number) {
    const receivedLetter = await this.letterReceivedService.findOne(user, id);
    return { data: receivedLetter };
  }

  @ApiTags('Received Letter API')
  @ApiOperation({
    summary: '받은 편지 삭제 API',
    description: '받은 편지를 삭제합니다.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete('/:id')
  delete(@Param('id') id: number) {
    return this.letterReceivedService.delete(id);
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
  @Get('/temp/:id')
  async findOneTemp(@Param('id') id: number) {
    const tempReceivedLetter = await this.letterReceivedService.findOneTemp(id);
    return { data: tempReceivedLetter };
  }

  @ApiTags('Received Letter API')
  @ApiOperation({
    summary: '외부 텍스트 편지 생성 API',
    description: '외부에서 받은 텍스트로 된 편지를 생성합니다.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Post('/texts')
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
  @Post('/images')
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
  @Post('/images/upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadExternalImgLetter(@UploadedFile() file: Express.MulterS3.File) {
    const letter = await this.letterReceivedService.uploadExternalLetterImage(
      file,
    );
    return { data: letter };
  }
}
