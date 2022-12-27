import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SendLetterDto {
  @ApiProperty({
    example: 'kakako-uuid',
    description: '카카오 uuid',
  })
  @IsString()
  readonly kakaoUuid: string;

  @ApiProperty({
    example: 'kakao-access-code',
    description: '카카오 access code',
  })
  @IsString()
  readonly kakaoAccessCode: string;
}
