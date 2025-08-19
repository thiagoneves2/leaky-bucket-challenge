// __tests__/leakyBucket.spec.ts
import { leakyBucketMiddleware } from '../middleware/leakyBucket.js';
import type { Context } from 'koa';
import {buckets} from '../middleware/leakyBucket.js';

describe('Leaky Bucket Middleware', () => {

  let ctx: Context;
  let next: jest.Mock;

  beforeEach(() => {
    //Clearing buckets for each test
    buckets.clear();

    ctx = {
      request: { headers: { authorization: 'Bearer token-do-usuario' } },
      state: { user: { id: 1 } },
      status: 200,
    } as unknown as Context;
    next = jest.fn();
  });


  // CHECKS IF THE REQUEST IS MADE (THERE ARE AVAILABLE TOKENS)
  it('should allow a request when a user has available tokens', async () => {
    
    await leakyBucketMiddleware(ctx, next);

    // Verifications
    expect(next).toHaveBeenCalledTimes(1); // Next middleware call
    expect(ctx.status).toBe(200); 
  });


  //CHECKING IF THE REQUEST IS REJECTED ONCE THE BUCKET IS FULL
  it('should reject a request when the limit is exceeded', async () => {
    
    // Simulates 10 requisitions 
    for (let i = 0; i < 10; i++) {
      await leakyBucketMiddleware(ctx, next);

      
      expect(next).toHaveBeenCalledTimes(i+1);
      expect(ctx.status).toBe(200);
    }

   
    await leakyBucketMiddleware(ctx, next);

    expect(next).toHaveBeenCalledTimes(10); 
    expect(ctx.status).toBe(429);
    expect(ctx.body).toEqual({ error: 'Request limit reached' }); //Checks if the algorithm reject the last requisition
  });

});
