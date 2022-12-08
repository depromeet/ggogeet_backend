import { PartialType } from '@nestjs/mapped-types';
import { CreateKakaoUserDto } from './create-kakaouser.dto';

export class UpdateKakaoUserDto extends PartialType(CreateKakaoUserDto) {}
