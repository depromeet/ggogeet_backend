import { PartialType } from '@nestjs/swagger';
import { CreateNoticeDto } from './createNotice.dto';

export class UpdateNoticeDto extends PartialType(CreateNoticeDto) {}
