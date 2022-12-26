import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateNoticeDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly content: string;
}
