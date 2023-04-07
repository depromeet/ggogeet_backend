import { ApiProperty } from '@nestjs/swagger';

export class ReminderStautsResponseDto {
  @ApiProperty({
    example: 1,
    description: 'Reminder id',
  })
  id: number;

  @ApiProperty({
    example: true,
    description: '완료 여부',
  })
  isDone: boolean;

  constructor(id: number, isDone: boolean) {
    this.id = id;
    this.isDone = isDone;
  }
}
