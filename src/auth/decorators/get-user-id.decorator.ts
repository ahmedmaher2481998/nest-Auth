import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getCurrentUserId = createParamDecorator(
  (context: ExecutionContext) => {
    const ctx = context.switchToHttp();
    const user = ctx.getRequest().user;

    return user['sub'];
  },
);
