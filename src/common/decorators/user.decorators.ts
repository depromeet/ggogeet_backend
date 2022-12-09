import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ReqUser = createParamDecorator(
  (_data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const userObj = request.user;

    return userObj;
  },
);
