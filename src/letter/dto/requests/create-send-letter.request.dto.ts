import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSendLetterDto {
  @IsNumber()
  @IsOptional()
  readonly user_id: number;

  @IsNumber()
  @IsOptional()
  readonly receiver_id?: number;

  @IsString()
  @IsOptional()
  readonly kakao_uuid?: string;

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

  @IsString()
  readonly kakao_access_code: string;
}
