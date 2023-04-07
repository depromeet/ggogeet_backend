import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateExternalImgLetterDto {
  @IsString()
  @ApiProperty({
    example: '행복한 크리스마스 보내',
    description: '편지 제목',
  })
  readonly title: string;

  @IsUrl()
  @ApiProperty({
    example: 'https://s3.ggo-geet.com/letter/1.png',
    description: '편지 이미지 url',
  })
  readonly imageUrl: string;

  @IsDateString()
  @ApiProperty({
    example: '2022-12-25 00:00:00',
    description: '편지 받은 날짜',
  })
  readonly receivedAt: Date;

  @IsString()
  @ApiProperty({
    example: 'Pretty Minusu',
    description: '받는 사람 닉네임: 받는 유저가 회원이 아닐 경우 입력',
  })
  readonly senderNickname: string;

  @IsNumber()
  @ApiProperty({
    example: 1,
    description: '상황 id',
  })
  readonly situationId: number;
}
