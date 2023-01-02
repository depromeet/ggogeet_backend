import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SendLetterDto {
  @ApiProperty({
    example: 'kakako-uuid',
    description: '받는 친구의 카카오 uuid',
  })
  @IsString()
  readonly kakaoUuid: string;

  @ApiProperty({
    example: 'kakao-access-code',
    description: '메시지 api 사용하기 위한 카카오 인가 코드 (access code)',
  })
  @IsString()
  readonly kakaoAccessCode: string;
}
