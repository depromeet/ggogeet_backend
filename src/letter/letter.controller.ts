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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateExternalImgLetterDto } from './dto/create-external-letter-img.dto';
import { CreateExternalLetterDto } from './dto/create-external-letter.dto';
import { LetterService } from './letter.service';

@Controller('letters')
export class LetterController {
  constructor(private readonly letterService: LetterService) {}

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
