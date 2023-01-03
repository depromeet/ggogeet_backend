import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional } from 'class-validator';
import { PaginationRequest } from 'src/common/paginations/pagination.request';

export class FindAllReminderQueryDto extends PaginationRequest {
  @ApiProperty({ required: false, description: '완료 여부' })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  done?: boolean;
}
