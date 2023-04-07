import { ApiProperty } from '@nestjs/swagger';
import { Sentence } from 'src/sentence/entities/sentence.entity';

export class SentenceResponseDto {
  @ApiProperty({
    example: 1,
    description: '문장 id',
  })
  id: number;

  @ApiProperty({
    example: '생일축하해~',
    description: '문장 내용',
  })
  content: string;

  @ApiProperty({
    example: 3,
    description: '상황 id',
  })
  situationId: number;

  @ApiProperty({
    example: 'user',
    description: '문장 타입(유저, 공통)',
  })
  type: string;

  @ApiProperty({
    example: true,
    description: '공유 여부',
  })
  isShared: boolean;

  @ApiProperty({
    example: '2021-01-01 00:00:00',
    description: '생성 일자',
  })
  createdAt: Date;

  constructor(sentence: Sentence) {
    this.id = sentence.id;
    this.situationId = sentence.situationId;
    this.content = sentence.content;
    this.type = sentence.type;
    this.isShared = sentence.isShared;
    this.createdAt = sentence.createdAt;
  }
}
