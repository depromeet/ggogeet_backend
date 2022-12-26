import { PartialType } from '@nestjs/mapped-types';
import { CreateKakaoUserDto } from './createKakaoUser.dto';

export class UpdateKakaoUserDto extends PartialType(CreateKakaoUserDto) {}
