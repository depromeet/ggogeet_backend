import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateReminderDto {
  @IsString()
  @ApiProperty({
    example: '친구 생일 축하',
    description: '리마인더 제목',
  })
  readonly title: string;

  @IsString()
  @ApiProperty({
    example: '친구 생일 축하 편지 작성하기',
    description: '리마인더 내용',
  })
  readonly content: string;

  @IsNumber()
  @ApiProperty({
    example: 1,
    description: '리마인더 상황 id',
  })
  readonly situationId: number;

  @IsDateString()
  @ApiProperty({
    example: '2021-01-01 00:00:00',
    description: '이벤트 발생 시간',
  })
  readonly eventAt: Date;

  @IsBoolean()
  @ApiProperty({
    example: true,
    description: '알림 여부',
  })
  readonly alertOn: boolean;

  @IsDateString()
  @ApiProperty({
    example: '2021-01-01 00:00:00',
    description: '리마인더 알림 시간',
  })
  readonly alarmAt: Date;
}
