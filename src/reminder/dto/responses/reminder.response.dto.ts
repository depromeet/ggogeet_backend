import { ApiProperty } from '@nestjs/swagger';
import { Reminder } from 'src/reminder/entities/reminder.entity';

export class ReminderResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Reminder id',
  })
  id: number;

  @ApiProperty({
    example: '친구 생일 축하',
    description: '리마인더 제목',
  })
  title: string;

  @ApiProperty({
    example: '친구 생일 축하 편지 작성하기',
    description: '리마인더 내용',
  })
  content: string;

  @ApiProperty({
    example: '2021-01-01 00:00:00',
    description: '이벤트 발생 시간',
  })
  eventAt: Date;

  @ApiProperty({
    example: true,
    description: '알림 여부',
  })
  alertOn: boolean;

  @ApiProperty({
    example: '2021-01-01 00:00:00',
    description: '리마인더 알림 시간',
  })
  alarmAt: Date;

  @ApiProperty({
    example: true,
    description: '완료 여부',
  })
  isDone: boolean;

  @ApiProperty({
    example: '생일',
    description: '상황 내용',
  })
  situation: string;

  constructor(reminder: Reminder) {
    this.id = reminder.id;
    this.title = reminder.title;
    this.content = reminder.content;
    this.eventAt = reminder.eventAt;
    this.alertOn = reminder.alertOn;
    this.alarmAt = reminder.alarmAt;
    this.isDone = reminder.isDone;
    this.situation = reminder.situation.content;
  }
}
