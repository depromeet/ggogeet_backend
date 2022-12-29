import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateNoticeDto {
  @IsString()
  @ApiProperty({
    example: '반갑습니다.',
    description: '공지사항 제목',
  })
  readonly title: string;

  @IsString()
  @ApiProperty({
    example: '반갑습니다. 이 서비스는 ...',
    description: '공지사항 내용',
  })
  readonly content: string;
}
