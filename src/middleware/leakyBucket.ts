import Koa from 'koa';

export const buckets = new Map<number, IClientBucket>();

// Client Interface
interface IClientBucket {
  tokens: number;
  lastDrip: number;
}

const CAPACITY = 10;
const DRIP_INTERVAL = 1000 * 60 * 60; // 1 hour = 3600000 ms

export const leakyBucketMiddleware = async(ctx: Koa.Context, next: Koa.Next) =>{

    const userId = ctx.state.user.id;

    console.log(`\n--- Requisição recebida para o usuário: ${userId} ---`);

    if (!buckets.has(userId)) {
        buckets.set(userId, { tokens: CAPACITY, lastDrip: Date.now() });
        console.log(`[Balde] Novo balde criado para o usuário ${userId}`);
        }

        const bucket = buckets.get(userId)!;

        // Checks for new tokens available
        const now = Date.now();
        const timePassed = now - bucket.lastDrip;
        const tokensToAdd = Math.floor(timePassed / DRIP_INTERVAL);

        bucket.tokens = Math.min(bucket.tokens + tokensToAdd, CAPACITY);
        bucket.lastDrip = now;
        
        console.log(`[Balde] Tokens atuais antes da requisição: ${bucket.tokens}`);

        if (bucket.tokens > 0) {
        bucket.tokens--;
        console.log(`[Balde] Requisição permitida. Tokens restantes: ${bucket.tokens}`);
        await next();
        } else {
        ctx.status = 429; // Too Many Requests
        ctx.body = { error: 'Request limit reached' };
        console.log(`[Balde] Requisição rejeitada. Balde vazio!`);
    }
}