// let urlPath = 'http://localhost:3000'
let urlPath = ''

// 判断是否生产环境
if(process.env.NODE_ENV == 'production'){
    if(process.env.EGG_SERVER_ENV == 'test'){
        urlPath = 'http://test-m.xxd.com'
    }else if(process.env.EGG_SERVER_ENV == 'dev'){
        urlPath = 'http://dev-m.xxd.com'
    }else if(process.env.EGG_SERVER_ENV == 'stage'){
        urlPath = 'http://stage-m.xxd.com'
    }else if(process.env.EGG_SERVER_ENV == 'prod'){
        urlPath = 'http://m.xinxindai.com'
    }else{
        urlPath = ''
    }
}
export default urlPath