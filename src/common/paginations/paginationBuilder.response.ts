/*
 * PaginationBuilder is a class to create a new PageResponse object
 * Using Builder Pattern, To prevent the error of the order of the arguments
 * when creating a new PageResponse object
 * .setData(data)
 * .setPage(page)
 * .setTake(take)
 * .setTotalCount(totalCount)
 * .build()
 */

import { PaginationResponse } from './pagination.response';

export class PaginationBuilder<T> {
  _data: T[];
  _page: number;
  _take: number;
  _totalCount: number;

  setData(data: T[]) {
    this._data = data;
    return this;
  }

  setPage(page: number) {
    this._page = page;
    return this;
  }

  setTake(take: number) {
    this._take = take;
    return this;
  }

  setTotalCount(totalCount: number) {
    this._totalCount = totalCount;
    return this;
  }

  build() {
    return new PaginationResponse(this);
  }
}
