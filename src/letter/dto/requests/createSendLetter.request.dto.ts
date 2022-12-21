import { IsDateString, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateSendLetterDto {
  @IsNumber()
  @IsOptional()
  readonly userId: number;

  @IsNumber()
  @IsOptional()
  readonly receiverId?: number;

  @IsString()
  @IsOptional()
  readonly kakaoUuid?: string;

  @IsString()
  readonly receiverNickname: string;

  @IsNumber()
  readonly situationId: number;

  @IsString()
  readonly title: string;
  
  @IsString()
  readonly content: string;

  // @IsDateString()
  // readonly date: Date;

  @IsString()
  readonly templateUrl: string;

  @IsString()
  @IsOptional()
  readonly kakaoAccessCode: string;
}
