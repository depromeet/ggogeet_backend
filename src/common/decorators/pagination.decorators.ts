import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import {
  PaginationDefault,
  PaginationRequest,
} from '../paginations/pagination.request';

/*
 * @GetPagination() is a decorator that returns a PagenationRequest object.
 * @GetPagination() pagination: PaginationRequest
 */
export const GetPagination = createParamDecorator(
  (_data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const page = request.query?.page || PaginationDefault.PAGE_DEFAULT;
    const take = request.query?.take || PaginationDefault.TAKE_DEFAULT;

    const pagenationRequest: PaginationRequest = {
      page: page,
      take: take,
      getPage: () => {
        return page;
      },
      getSkip: () => {
        return (page - 1) * take;
      },
      getTake: () => {
        return take;
      },
    };

    return pagenationRequest;
  },
);
