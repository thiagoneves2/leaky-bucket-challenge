//################################################## IMPORTS ##################################################
import Koa from 'koa';
import {graphqlHTTP} from 'koa-graphql';
import KoaRouter from 'koa-router';
import koaBodyParser from 'koa-bodyparser';
import jwt from 'jsonwebtoken'
import {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLFloat
} from 'graphql';

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


const sendPixMutation = {
  type: GraphQLString, // mutation return (In this case a message)
  args: {
    pixKey: { type: GraphQLString }, 
    value: { type: GraphQLFloat }
  },
  resolve: () => 'Success in pix transfer'
};

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    sendPix: sendPixMutation
  }
});

// final schema
const schema = new GraphQLSchema({
  mutation: mutationType
});

const rootValue = {
  sendPix: async (args: { pixKey: string; value: number }, context: { ctx: Koa.Context }) => {
    
    const { id } = context.ctx.state.user;

    //Here would be the logic for account changes

    // For now only a message for success
    return `Pix value R$${args.value} to key ${args.pixKey} sent succesfully by:  ${id}.`;
  }
};

const app = new Koa();
const router = new KoaRouter();
const PORT = 3000;

const buckets = new Map<number, IClientBucket>();
const CAPACITY = 10;
const DRIP_INTERVAL = 1000 * 60 * 60; // 1 hour = 3600000 ms

app.use(koaBodyParser());
app.use(router.routes());
app.use(router.allowedMethods());


// Login route, so only logged in users can access the buckets (UNPROTECTED)
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

app.use(
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
    context: (ctx: Koa.Context) => ({ ctx }),
  })
);

// Auth middleware (APPLIED TO ALL ROUTES THAT COME AFTER)
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

// Leaky bucket middleware (Guarantees that requests are processed only if tokens are available)
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

router.all('/graphql', graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
    context: (ctx: Koa.Context) => ({ ctx }),
  }) as unknown as KoaRouter.IMiddleware);


// Protected test route
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



app.listen(PORT, ()=>{

    console.log(`Server running on http://localhost:${PORT}`);

})