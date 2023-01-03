import { Type } from 'class-transformer';
import { IsOptional } from 'class-validator';

export enum PaginationDefault {
  PAGE_DEFAULT = 1,
  TAKE_DEFAULT = 10,
  SKIP_DEFAULT = 0,
}

export class PaginationRequest {
  @Type(() => Number)
  @IsOptional()
  page?: number = PaginationDefault.PAGE_DEFAULT;

  @Type(() => Number)
  @IsOptional()
  take?: number = PaginationDefault.TAKE_DEFAULT;

  getSkip() {
    return (this.page - 1) * this.take || PaginationDefault.SKIP_DEFAULT;
  }

  getPage() {
    return this.page;
  }

  getTake() {
    return this.take;
  }
}
