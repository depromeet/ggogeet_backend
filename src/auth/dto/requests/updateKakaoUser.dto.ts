import { PartialType } from '@nestjs/swagger';
import { CreateKakaoUserDto } from './createKakaoUser.dto';

export class UpdateKakaoUserDto extends PartialType(CreateKakaoUserDto) {}
