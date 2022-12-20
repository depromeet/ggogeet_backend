import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateSentenceDto {
  @IsString()
  readonly content: string;

  @IsBoolean()
  readonly isShared: boolean;

  @IsNumber()
  readonly situationId: number;
}
