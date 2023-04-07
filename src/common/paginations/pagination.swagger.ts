import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiQuery,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginationResponse } from './pagination.response';

/*
 * @ApiPaginatedResponse() is a decorator to create a swagger document for a paginated response.
 */
export const ApiPaginationResponse = <TModel extends Type>(model: TModel) => {
  return applyDecorators(
    ApiOkResponse({
      schema: {
        allOf: [
          { $ref: getSchemaPath(PaginationResponse) },
          {
            properties: {
              data: {
                type: 'array',
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    }),
    ApiExtraModels(PaginationResponse),
    ApiExtraModels(model),
  );
};

/*
 * @ApiPaginationRequst() is a decorator to create a swagger document for a paginated request.
 */
export const ApiPaginationRequst = () => {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      description: '페이지 번호',
    }),
    ApiQuery({
      name: 'take',
      required: false,
      type: Number,
      description: '페이지당 아이템 수',
    }),
  );
};
