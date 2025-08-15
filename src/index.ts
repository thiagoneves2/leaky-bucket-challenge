import Koa from 'koa';
import KoaRouter from 'koa-router';
import koaBodyParser from 'koa-bodyparser';
import jwt from 'jsonwebtoken'

//DATABASE
const users = [{
  id: 1,
  email: 'test@example.com',
  password: 'password123'
}];


// Client Interface
interface IClientBucket {
  tokens: number;
  lastDrip: number;
}

interface ILoginRequest {
  email: string;
  password: string;
}

interface IJwtPayload {
  userId: number;
}


const app = new Koa();
const router = new KoaRouter();
const PORT = 3000;

const buckets = new Map<number, IClientBucket>();
const CAPACITY = 10;
const DRIP_INTERVAL = 1000 * 60 * 60; // 1 hour = 3600000 ms

app.use(koaBodyParser());



app.use(router.routes());
app.use(router.allowedMethods());

// ################################################## ROUTES ##################################################
// Login route, so only logged in users can access the buckets 
router.post('/login', async (ctx)=>{
    
    const { email, password } = ctx.request.body as ILoginRequest;

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        //Generate token
        const token = jwt.sign({ userId: user.id }, '<pix secret>', { expiresIn: '1h' });

        ctx.body = { token };
    } else {
        ctx.status = 401; // Unauthorized
        ctx.body = { error: 'Unauthorized' };
    }
})

// Get User data based on ID available in ctx.state.user
router.get('/me', async (ctx) => {

    const { id } = ctx.state.user;

    const user = users.find(u => u.id === id);
    if (user) 
    {
        ctx.body = user;
    } 
    else 
    {
        ctx.status = 404; // Not Found
        ctx.body = { error: 'User not found' };
    }
});

//################################################## MIDDLEWARES ##################################################

// Leaky bucket middleware
app.use(async (ctx, next) => {
    
  const userId = ctx.state.user.id;


  if (!buckets.has(userId)) {
    buckets.set(userId, { tokens: CAPACITY, lastDrip: Date.now() });
  }

  const bucket = buckets.get(userId)!;

  // Checks for new tokens available
  const now = Date.now();
  const timePassed = now - bucket.lastDrip;
  const tokensToAdd = Math.floor(timePassed / DRIP_INTERVAL);

  bucket.tokens = Math.min(bucket.tokens + tokensToAdd, CAPACITY);
  bucket.lastDrip = now;

  if (bucket.tokens > 0) {
    bucket.tokens--;
    await next();
  } else {
    ctx.status = 429; // Too Many Requests
    ctx.body = { error: 'Request limit reached' };
  }
});


app.use(async (ctx, next) => {

    const authHeader = ctx.request.headers.authorization;
    if (!authHeader) {
        ctx.status = 401; // Unauthorized
        ctx.body = { error: 'No token' };
        return;
    }

    // Get only the token
    const token = authHeader.split(' ')[1] as string;

    try {
        const decoded = jwt.verify(token, '<pix secret>');

        // Checking if the property userId exists
        if (typeof decoded === 'object' && decoded !== null && 'userId' in decoded)
        {  
            ctx.state.user = { id: (decoded as { userId: number }).userId };
            await next();
        } 
        else 
        {
            ctx.status = 401;
            ctx.body = { error: 'Token is not valid' };
        }
        await next();
    } 
    catch (err) 
    {
        ctx.status = 401; // Unauthorized
        ctx.body = { error: 'Unauthorized token' };
    }
});

app.listen(PORT, ()=>{

    console.log(`Server running on http://localhost:${PORT}`);

})