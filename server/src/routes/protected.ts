import Router from 'koa-router';
import { graphqlHTTP } from 'koa-graphql';
import { schema } from '../graphql/schema';
import Koa from 'koa';
import { users } from '../db/users';

export const protectedRouter = new Router();

protectedRouter.all(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
    context: (ctx: Koa.Context) => ({ ctx }),
  }) as unknown as Router.IMiddleware,
);

protectedRouter.get('/me', async (ctx) => {
  const { id } = ctx.state.user;
  const user = users.find((u) => u.id === id);
  if (!user) {
    ctx.status = 404;
    ctx.body = { error: 'User not found' };
    return;
  }
  ctx.body = user;
});
