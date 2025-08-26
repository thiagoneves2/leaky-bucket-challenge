import Koa from 'koa';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/env';

export const authMiddleware = async (ctx: Koa.Context, next: Koa.Next) => {
  const authHeader = ctx.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    ctx.status = 401;
    ctx.body = { error: 'No token' };
    return;
  }

  const token = authHeader.split(' ')[1] as string;

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    const userId = (decoded as any)?.userId;

    if (!userId) {
      ctx.status = 401;
      ctx.body = { error: 'Token is not valid' };
      return;
    }

    ctx.state.user = { id: userId };
    await next();
  } catch {
    ctx.status = 401;
    ctx.body = { error: 'Unauthorized token' };
  }
};
