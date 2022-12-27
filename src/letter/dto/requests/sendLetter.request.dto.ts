import { IsString } from 'class-validator';

export class SendLetterDto {
  @IsString()
  readonly kakaoUuid: string;

  @IsString()
  readonly kakaoAccessCode: string;
}
