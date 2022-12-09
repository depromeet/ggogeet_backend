import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateReminderDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly content: string;

  @IsNumber()
  readonly situation_id: number;

  @IsDateString()
  readonly event_at: Date;

  @IsBoolean()
  readonly alert_on: boolean;

  @IsDateString()
  readonly alarm_at: Date;
}
