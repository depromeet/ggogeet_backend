import { IsDateString, IsNumber, IsString, IsOptional } from 'class-validator';

export class CreateSendLetterDto {
  @IsNumber()
  @IsOptional()
  readonly user_id: number;

  @IsNumber()
  @IsOptional()
  readonly receiver_id?: number;

  @IsString()
  readonly receiver_nickname: string;

  @IsNumber()
  readonly situation_id: number;

  @IsString()
  readonly content: string;

  @IsDateString()
  readonly date: Date;

  @IsString()
  readonly template_url: string;
}
