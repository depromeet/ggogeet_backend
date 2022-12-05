import { IsDateString, IsString } from 'class-validator';

export class CreateExternalLetterDto {
  @IsString()
  readonly content: string;

  @IsDateString()
  readonly date: Date;

  @IsString()
  readonly sender: string;

  @IsString()
  readonly template: string;
}
