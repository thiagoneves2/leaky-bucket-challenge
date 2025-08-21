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
import { leakyBucketMiddleware } from './middleware/leakyBucket';

//DATABASE
const users = [{
  id: 1,
  email: 'test@example.com',
  password: 'password123'
}];


interface ILoginRequest {
  email: string;
  password: string;
}

interface IJwtPayload {
  userId: number;
}

const JWT_SECRET = process.env.JWT_SECRET ?? 'dev-secret';

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

// Empty query type 
const queryType = new GraphQLObjectType({

  name: 'Query',
  fields:{
    hello:{
      type: GraphQLString,
      resolve: ()=> 'Query String',
    },
  },

});

// final schema
const schema = new GraphQLSchema({
  query: queryType,
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
const PORT = 3000;

//SEPARATING PUBLIC AND PROTECTED ROUTES
const publicRouter = new KoaRouter();
const protectedRouter = new KoaRouter();

// GLOBAL INITIAL MIDDLEWARE
app.use(koaBodyParser());



// Login route, so only logged in users can access the buckets (UNPROTECTED)
publicRouter.post('/login', async (ctx)=>{
    
    const { email, password } = ctx.request.body as ILoginRequest;

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        //Generate token
        const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

        ctx.body = { token };
    } else {
        ctx.status = 401; // Unauthorized
        ctx.body = { error: 'Unauthorized' };
    }
})

// PUBLIC ROUTE
app.use(publicRouter.routes()).use(publicRouter.allowedMethods())

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
        const decoded = jwt.verify(token, JWT_SECRET);

        // Checking if the property userId exists
        if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
          ctx.status = 401;
          ctx.body = { error: "Token is not valid" };
          return; 
        }

        ctx.state.user = { id: (decoded as any).userId };

        await next();
    } 
    catch (err) 
    {
        ctx.status = 401; // Unauthorized
        ctx.body = { error: 'Unauthorized token' };
        return;
    }
});

// Leaky bucket middleware (Guarantees that requests are processed only if tokens are available)
app.use(leakyBucketMiddleware);

protectedRouter.all('/graphql', graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
    context: (ctx: Koa.Context) => ({ ctx }),
  }) as unknown as KoaRouter.IMiddleware);


// Protected test route
protectedRouter.get('/me', async (ctx) => {

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
// PROTECTED ROUTES
app.use(protectedRouter.routes()).use(protectedRouter.allowedMethods())



app.listen(PORT, ()=>{

    console.log(`Server running on http://localhost:${PORT}`);

})