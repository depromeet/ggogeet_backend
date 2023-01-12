import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsDateString, IsOptional } from 'class-validator';
import { PaginationRequest } from 'src/common/paginations/pagination.request';

export class findAllReceviedLetterDto extends PaginationRequest {
  @ApiPropertyOptional({
    description: '보낸 사람 ID 리스트',
    example: ['1', '2'],
  })
  @IsOptional()
  @IsArray()
  readonly senders: string[];

  @ApiPropertyOptional({
    description: '검색할 상황 ID 리스트',
    example: ['1', '2'],
  })
  @IsOptional()
  @IsArray()
  readonly situations: string[];

  @ApiPropertyOptional({
    example: '2022-01-01 00:00:00',
    description: '편지 검색 시작 날짜',
  })
  @IsOptional()
  @IsDateString()
  readonly startDate: Date;

  @ApiPropertyOptional({
    example: '2023-12-25 00:00:00',
    description: '편지 검색 시작 날짜',
  })
  @IsOptional()
  @IsDateString()
  readonly endDate: Date;

  @ApiPropertyOptional({
    description: '날짜순 정렬',
    example: 'ASC',
  })
  @IsOptional()
  readonly order: string;
}

export class findAllSentLetterDto extends PaginationRequest {
  @ApiPropertyOptional({
    description: '받는 사람 ID 리스트',
    example: ['1', '2'],
  })
  @IsOptional()
  @IsArray()
  readonly receivers: string[];

  @ApiPropertyOptional({
    description: '검색할 상황 ID 리스트',
    example: ['1', '2'],
  })
  @IsOptional()
  @IsArray()
  readonly situations: string[];

  @ApiPropertyOptional({
    example: '2022-01-01 00:00:00',
    description: '편지 검색 시작 날짜',
  })
  @IsOptional()
  @IsDateString()
  readonly startDate: Date;

  @ApiPropertyOptional({
    example: '2023-12-25 00:00:00',
    description: '편지 검색 시작 날짜',
  })
  @IsOptional()
  @IsDateString()
  readonly endDate: Date;

  @ApiPropertyOptional({
    description: '날짜순 정렬',
    example: 'ASC',
  })
  @IsOptional()
  readonly order: string;
}
