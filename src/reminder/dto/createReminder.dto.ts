import { IsBoolean, IsDateString, IsNumber, IsString } from 'class-validator';

export class CreateReminderDto {
  @IsString()
  readonly title: string;

  @IsString()
  readonly content: string;

  @IsNumber()
  readonly situationId: number;

  @IsDateString()
  readonly eventAt: Date;

  @IsBoolean()
  readonly alertOn: boolean;

  @IsDateString()
  readonly alarmAt: Date;
}
