const next = require('next');
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';



console.log ("PROCESS ：：：" + dev);

const app = next({ dev });
const handle = app.getRequestHandler();
const Koa = require('koa');
const Router = require('koa-router');
app.prepare()
    .then(() => {
        const server = new Koa();
        const router = new Router();
        router.get('/home', async ctx => {
            await app.render(ctx.req, ctx.res, '/home', ctx.query);
            ctx.respond = false
        });

        router.get('/contactus', async ctx => {
            await app.render(ctx.req, ctx.res, '/contactus', ctx.query);
            ctx.respond = false
        });

        router.get('/login', async ctx => {
            await app.render(ctx.req, ctx.res, '/login', ctx.query);
            ctx.respond = false
        });

        router.get('/register', async ctx => {
            await app.render(ctx.req, ctx.res, '/register', ctx.query);
            ctx.respond = false
        });

        router.get('/password', async ctx => {
            await app.render(ctx.req, ctx.res, '/password', ctx.query);
            ctx.respond = false
        });

        router.get('/mypurse', async ctx => {
            await app.render(ctx.req, ctx.res, '/mypurse', ctx.query);
            ctx.respond = false
        });

        router.get('/recharge', async ctx => {
            await app.render(ctx.req, ctx.res, '/recharge', ctx.query);
            ctx.respond = false
        });

        router.get('/personal', async ctx => {
            await app.render(ctx.req, ctx.res, '/personal', ctx.query);
            ctx.respond = false
        });

        router.get('/openaccount', async ctx => {
            await app.render(ctx.req, ctx.res, '/openaccount', ctx.query);
            ctx.respond = false
        });

        router.get('/consumes', async ctx => {
            await app.render(ctx.req, ctx.res, '/consumes', ctx.query);
            ctx.respond = false
        });

        router.get("/loan" , async ctx => {
            await app.render(ctx.req , ctx.res , "/loan" , ctx.query);
            ctx.respond = false;
        });

        router.get("/newbid" , async ctx => {
            await app.render(ctx.req , ctx.res , "/newbid" , ctx.query);
            ctx.respond = false;
        });

        router.get("/proxy" , async ctx => {
            await app.render(ctx.req , ctx.res , "/proxy" , ctx.query);
            ctx.respond = false;
        });

        router.get('*', async ctx => {
            await handle(ctx.req, ctx.res);
            ctx.respond = false
        });

        server.use(async (ctx, next) => {
            ctx.res.statusCode = 200
            await next()
        });




        server.use(router.routes());

        if (dev) {
            Object.keys(proxyTable).forEach((path)=> {
                let options = proxyTable[path];
                server.use(httpProxy(path , options));
            });
        }

        server.listen(port, (err) => {
            if (err) throw err
            console.log(`> Ready on http://localhost:${port}`);
            if (dev) {
                var openBrowser = require('react-dev-utils/openBrowser');
                var uri = "localhost" + ':' + port + "/home";
                console.log('Listening at ' + uri + '\n');
                if (openBrowser(uri)) {
                    console.log('The browser tab has been opened!');
                }
            }
        });

    });