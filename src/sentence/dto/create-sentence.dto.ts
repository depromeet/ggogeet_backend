import { IsBoolean, IsNumber, IsString } from 'class-validator';

export class CreateSentenceDto {
  @IsString()
  readonly content: string;

  @IsBoolean()
  readonly is_shared: boolean;

  @IsNumber()
  readonly situation_id: number;
}
