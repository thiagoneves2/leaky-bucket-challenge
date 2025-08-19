import { leakyBucketMiddleware } from '../src/middleware/leakyBucket.js'; 
import type { Context } from 'koa';

describe('Leaky Bucket Middleware', () => {
  let ctx: Context;
  let next: jest.Mock;

  beforeEach(() => {
    ctx = {
      request: {
        headers: {
          authorization: 'Bearer token-do-usuario'
        }
      },
      state: {
        user: { id: 1 }
      },
      status: 200
    } as unknown as Context;
    next = jest.fn();
  });

  it('should allow a request if tokens are available', async () => {
    // Simula uma requisição
    await leakyBucketMiddleware(ctx, next);

    // Verifica se a requisição passou para o próximo middleware
    expect(next).toHaveBeenCalledTimes(1);
    expect(ctx.status).toBe(200);
  });
});