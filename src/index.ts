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

//################################################## APP ##################################################
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