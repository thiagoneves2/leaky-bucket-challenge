// __tests__/leakyBucket.spec.ts
import { leakyBucketMiddleware } from '../middleware/leakyBucket.js';
import type { Context } from 'koa';

describe('Leaky Bucket Middleware', () => {

  it('should allow a request when a user has available tokens', async () => {
    // Simulates the context
    const ctx = {
      request: {
        headers: {
          authorization: 'Bearer token-do-usuario'
        }
      },
      state: {
        user: { id: 1 } // User authenticades (User 1)
      },
      status: 200
    } as unknown as Context;

    // Mock for next function
    const next = jest.fn();

    await leakyBucketMiddleware(ctx, next);

    // Verifications
    expect(next).toHaveBeenCalledTimes(1); // Next middleware call
    expect(ctx.status).toBe(200); 
  });

});