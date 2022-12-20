import { PartialType } from '@nestjs/mapped-types';
import { CreateKakaoUserDto } from 'src/auth/dto/requests/createKakaoUser.dto';

export class UpdateUserDto extends PartialType(CreateKakaoUserDto) {}
