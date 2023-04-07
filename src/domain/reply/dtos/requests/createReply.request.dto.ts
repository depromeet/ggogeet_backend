import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateReplyDto {
  @IsNumber()
  @ApiProperty({
    example: 1,
    description: '편지 id',
  })
  readonly letterBodyId: number;

  @IsString()
  @ApiProperty({
    example: '정말 고마워',
    description: '답장 내용',
  })
  readonly content: string;
}
