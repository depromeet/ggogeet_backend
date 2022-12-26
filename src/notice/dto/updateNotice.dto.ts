import { PartialType } from '@nestjs/mapped-types';
import { CreateNoticeDto } from './createNotice.dto';

export class UpdateNoticeDto extends PartialType(CreateNoticeDto) {}
