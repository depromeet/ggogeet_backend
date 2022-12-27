import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateDraftLetterDto {
  @IsNumber()
  @IsOptional()
  readonly userId: number;

  @IsNumber()
  @IsOptional()
  @ApiProperty({
    example: 1,
    description:
      '유저 id : 받는 유저가 비회원일 경우 입력 X, 받는 유저가 회원일 경우 입력',
  })
  readonly receiverId?: number;

  @IsString()
  @ApiProperty({
    example: 'Pretty Minusu',
    description: '받는 사람 닉네임',
  })
  readonly receiverNickname: string;

  @IsNumber()
  @ApiProperty({
    example: 1,
    description: '상황 id',
  })
  readonly situationId: number;

  @IsString()
  @ApiProperty({
    example: '생일 축하해',
    description: '편지 제목',
  })
  readonly title: string;

  @IsString()
  @ApiProperty({
    example: '생일 축하하고 싶어서 편지를 써봤어',
    description: '편지 내용',
  })
  readonly content: string;

  @IsString()
  @ApiProperty({
    example: 'https://cdn.ggo-geet.com/letter-template/1.png',
    description: '편지 템플릿 url',
  })
  readonly templateUrl: string;
}
