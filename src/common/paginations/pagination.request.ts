import { IsNumberString, IsOptional } from 'class-validator';

export enum PaginationDefault {
  PAGE_DEFAULT = 1,
  TAKE_DEFAULT = 10,
}

export class PaginationRequest {
  @IsNumberString()
  @IsOptional()
  page?: number | PaginationDefault.PAGE_DEFAULT;

  @IsNumberString()
  @IsOptional()
  take?: number | PaginationDefault.TAKE_DEFAULT;

  constructor(page?: number, take?: number) {
    this.page = page;
    this.take = take;
  }

  getSkip() {
    return (this.page - 1) * this.take;
  }

  getTake() {
    return this.take;
  }
}
