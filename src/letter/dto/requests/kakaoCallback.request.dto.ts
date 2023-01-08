import { IsNumberString, IsString } from 'class-validator';

export class KakaoMessageCallbackDto {
  @IsString()
  CHAT_TYPE: string;

  @IsString()
  HASH_CHAT_ID: string;

  @IsNumberString()
  TEMPLATE_ID: string;

  @IsNumberString()
  TEMP_LETTER_ID: string;
}
