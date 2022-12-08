import {
  Controller,
  Get,
  Param,
  Post,
  HttpStatus,
  HttpCode,
  Delete,
  Body,
  UseInterceptors,
  UploadedFile,
  Query,
  UseGuards,
  Req,
  Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CreateExternalImgLetterDto } from './dto/create-external-letter-img.dto';
import { CreateExternalLetterDto } from './dto/create-external-letter.dto';
import { CreateSendLetterDto } from './dto/create-send-letter.dto';
import { LetterService } from './letter.service';

@Controller('letters')
export class LetterController {
  constructor(private readonly letterService: LetterService) {}

  @Post('/send')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.CREATED)
  async createSendLetter(
    @Req() req,
    @Res() res,
    @Body() createSendLetterDto: CreateSendLetterDto,
  ) {
    const letterData = {
      user_id: req.user.id,
      ...createSendLetterDto,
    };
    const sendLetter = await this.letterService.createSendLetter(letterData);

    res.send(sendLetter);
  }

  @Get()
  findAll(
    @Query()
    query: {
      offset: number;
      limit: number;
      order: string;
      from_date: string;
      to_date: string;
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
