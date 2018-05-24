const next = require('next');
const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';


var proxyTable =  {
    "/apih5/": {
        target: "http://test-m.xxd.com",
        changeOrigin: true
    },
    // "/": {
    //     target: "http://test-m.xxd.com",
    //     changeOrigin: true
    // },
    "/activityCenter":{
        target: "http://uat.xxd.com",
        changeOrigin: true
    },
    "/m/": {
        target: "http://test-m.xxd.com",
        changeOrigin: true
    },
    "/v5_mobile/": {
        target: "http://stage.xxd.com",
        changeOrigin: true
    },
    "/pc/":{
        target:"http://www.xinxindai.com/detail/sevengold.html",
        pathRewrite: {'^/pc': '/'},
        changeOrigin : true,
    },
    "/detail/":{
        target:"http://www.xinxindai.com",
        changeOrigin : true,
    },
    "/www/":{
        target:"http://www.xinxindai.com/detail/",
        pathRewrite: {'^/www/': '/'},
        changeOrigin : true,
    },
    "/test/home/":{
        target:"http://dev-m.xxd.com/apih5/api/homes",
        pathRewrite: {'^/test/home/': '/'},
        changeOrigin : true
    },
    "/userCenter/":{
        target:"http://stage-m.xxd.com/userCenter/",
        pathRewrite: {'^/userCenter/': '/'},
        changeOrigin : true
    },
    "/activityCenter/":{
        target:'http://stage-m.xxd.com/activityCenter',
        pathRewrite:{'^/activityCenter/':'/'},
        changeOrigin: true
    }
}

console.log ("PROCESS ：：：" + dev);

const app = next({ dev });
const handle = app.getRequestHandler();
const express = require('express');
app.prepare()
    .then(() => {
        const server = express();

        if (dev) {
            console.log ("dev:" + dev);
            const httpProxy = require('http-proxy-middleware');
            Object.keys(proxyTable).forEach((path)=> {
                let options = proxyTable[path];
                server.use(httpProxy(path , options));
            });
        }
        server.get('/',  (req, res) => {
            return app.render(req, res, '/home', req.query);
        });

        server.get('/home',  (req, res) => {
            return app.render(req, res, '/home', req.query);
        });

        server.get('/contactus',  (req, res) => {
            return app.render(req, res, '/contactus', req.query)
        });

        server.get('/financial',  (req, res) => {
            return app.render(req, res, '/financial', req.query)
        });

        server.get('/login',  (req, res) => {
            return app.render(req, res, '/login', req.query)
        });

        server.get('/register',  (req, res) => {
            return app.render(req, res, '/register', req.query)
        });

        server.get('/xinYiDaiRegister',  (req, res) => {
            return app.render(req, res, '/xinYiDaiRegister', req.query)
        });
        server.get('/password', (req, res) => {
            return app.render(req, res, '/password', req.query)
        });

        server.get('/mypurse',  (req, res) => {
            return app.render(req, res, '/mypurse', req.query)
        });

        server.get('/consumes',  (req, res) => {
            return app.render(req, res, '/consumes', req.query)
        });

        server.get("/loan" ,  (req, res) => {
            return app.render(req, res, '/loan', req.query)
        });

        server.get("/newbid" , (req, res) => {
            return app.render(req, res, '/newbid', req.query)
        });

        server.all('*', (req, res) => handle(req, res));

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