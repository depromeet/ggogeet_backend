import { PartialType } from '@nestjs/mapped-types';
import { CreateKakaoUserDto } from 'src/auth/dto/create-kakaouser.dto';

export class UpdateUserDto extends PartialType(CreateKakaoUserDto) {}
