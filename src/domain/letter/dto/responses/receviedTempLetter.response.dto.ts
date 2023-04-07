import { ApiProperty } from '@nestjs/swagger';

export class ReceviedTempLetterResponseDto {
  @ApiProperty({
    example: 1,
    description: '편지 ID',
  })
  id: number;

  @ApiProperty({
    example: 'Pretty Minusu',
    description: '보낸 사람 닉네임',
  })
  senderNickname: string;

  @ApiProperty({
    example: '2022-12-25 00:00:00',
    description: '받은 날짜',
  })
  receivedAt: Date;

  @ApiProperty({
    example: '크리스마스 축하해',
    description: '편지 내용',
  })
  content: string;

  @ApiProperty({
    example: 1,
    description: '상황 ID',
  })
  situationId: number;
}
