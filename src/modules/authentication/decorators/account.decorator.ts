import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Account = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  return ctx.switchToHttp().getRequest<Request>()['user'];
});
