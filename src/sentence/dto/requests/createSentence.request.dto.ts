import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateSentenceDto {
  @IsString()
  @ApiProperty({
    example: '생일 축하해',
    description: '문장 내용',
  })
  readonly content: string;

  @IsBoolean()
  @ApiProperty({
    example: true,
    description: '공유 여부',
  })
  readonly isShared: boolean;

  @IsNumber()
  @ApiProperty({
    example: 1,
    description: '문장 상황 id',
  })
  readonly situationId: number;
}
