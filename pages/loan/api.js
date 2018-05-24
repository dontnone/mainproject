var devHttp = 'http://localhost:3000/'
if(process.env.NODE_ENV != 'development'){
    devHttp = '/'
}
const urlParams = {
    loanProduct: 'integrationPlatform/products/',                              //..借款获取产品详情
    loanNext: 'integrationPlatform/products/instalment-plans/',                //..借款详情数据     
}
const repeatUrl = {}
for(let i in urlParams){
    urlParams[i] = devHttp + urlParams[i]
}
export default urlParams

