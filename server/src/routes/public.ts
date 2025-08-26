import Router from 'koa-router';
import jwt from 'jsonwebtoken';
import { users } from '../db/users';
import { JWT_SECRET } from '../config/env';

export const publicRouter = new Router();

type LoginBody = { email: string; password: string };

publicRouter.post('/login', async (ctx) => {
  const { email, password } = ctx.request.body as LoginBody;

  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) {
    ctx.status = 401;
    ctx.body = { error: 'Unauthorized' };
    return;
  }

  const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
  ctx.body = { token };
});
