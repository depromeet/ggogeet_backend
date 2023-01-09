import { ApiProperty } from '@nestjs/swagger';
import { SentenceResponseDto } from './sentence.response.dto';

export class SituationSentenceResponseDto {
  @ApiProperty({
    type: [SentenceResponseDto],
    description: '사용자 추가 문장(최대 5개)을 배열로 반환합니다.',
  })
  userSentence: SentenceResponseDto[];

  @ApiProperty({
    type: [SentenceResponseDto],
    description: '가이드 문장(5개)을 배열로 반환합니다.',
  })
  guideSentence: SentenceResponseDto[];
}

export class AllSentenceResponseDto {
  @ApiProperty({
    type: [SentenceResponseDto],
    description: '사용자 추가 문장(최대 5개)을 배열로 반환합니다.',
  })
  userSentence: SentenceResponseDto[];

  @ApiProperty({
    type: [SentenceResponseDto],
    description: '가이드 문장(5개)을 배열로 반환합니다.',
  })
  guideSentence: SentenceResponseDto[];
}
