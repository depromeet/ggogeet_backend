import { IsDateString, IsString } from 'class-validator';

export class CreateExternalImgLetterDto {
  @IsString()
  readonly image: string;

  @IsDateString()
  readonly date: Date;

  @IsString()
  readonly sender: string;

  @IsString()
  readonly template: string;
}
