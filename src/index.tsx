import Koa from 'koa';


const app = new Koa();
const PORT = 3000;

app.use(async(ctx, next)=>{
    ctx.body = 'App started';
})

app.listen(PORT, ()=>{

    console.log(`Server running on http://localhost:${PORT}`);

})