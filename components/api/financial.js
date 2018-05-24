import { cFetch } from '../../common/Promise'
import { Toast, Modal } from 'antd-mobile'
import urlPath from './url'
import fetch from 'isomorphic-fetch'

/**
 * 
 * @param {出借记录接口列表} 
 * { hotFinancial } : 获取热门理财产品列表
 * { financialDetail } : 获取理财产品详情
 * 
 */

//  获取热门理财产品列表
const hotFinancial = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/finances/hot`, {
        data: {
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }
}

//  获取热门理财产品列表
const hotFinancialOther = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/finances/hot-xyb-yyp`, {
        data: {
            productType: context.type
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }
}

//  获取理财产品详情
const financialDetail = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/finances/${context.id}`, {
        data: {
            productType: context.type
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }
}

//  获取理财产品加入记录
const financialJoinRecord = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/finances/join-record/${context.productId}`, {
        data: {
            page: context.page,
            pageSize: 40,
            productType: context.productType
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }else{
        Toast.info(res.message, 2)
    }
}

//  获取债券列表
const creditList = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/finances/borrow`, {
        data: {
            page: context.page,
            pageSize: 20
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }else{
        Toast.info(res.message, 2)
    }
}

//  用户资产
const userAccount = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/assets/overview`, {
        ctx: context,
        data: {
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }
}

//  新手标获取详情
const getNewBid = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/finances/new-tender`, {
        data: {
            month: context.month
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }
}

//  新手标加入记录
const newBidRecord = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/finances/new-tender-record`, {
        data: {
            reglintstId: context.reglintstId,
            currentPage: context.currentPage,
            pageSize: 40
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }
}

//  可用红包
const packageCanUser = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/red-packages/can-used`, {
        data: {
            productId: context.productId,
            productType: context.productType,
            amount: context.amount,
            page: context.page,
            pageSize: 20
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }else{
        Toast.info(res.message, 2)
    }
}

//  理财产品加入
const financialBuy = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/investments`, {
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: {
            productId: context.productId,
            productType: context.productType,
            redPackageCode: context.redPackageCode || '',
            couponId: context.couponId || '',
            investAmount: context.investAmount
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }else{
        Toast.info(res.message, 2)
    }
}


//  获取sign
const getSign = async (context) => {
    const res = await cFetch(`${urlPath}/m/memberDay922/genLoginSignInRedis.do`, {
        data: {
            userId: context.userId
        },
        isServerTime: false
    })
    return res
}

//  获取cost
const getCost = async (context) => {
    const res = await cFetch(`${urlPath}/m/account/cost.do`, {
        data: {
        },
        isServerTime: false
    })
    return res
}

//  获取债权详情的征信信息
const getLoanInfo = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/finances/bid/loan-info/` + context.bidCode, {
        data: {
            bidCode: context.bidCode
        },
        isServerTime: false
    })
    return res
}


//  获取每月份的新元宝的利率
const getEachNew = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/finances/max-apr-xyb`, {
        data: {
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }else{
        Toast.info(res.message, 2)
        return res.data
    }
}

//  获取新宜贷产品详情
const investmentXyd = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/finances/xyd-detail/${context.borrowId}`, {
        data: {
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }else{
        Toast.info(res.message, 2)
    }
}

//  新宜贷投标记录
const xydRecord = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/finances/invest-record/${context.bidCode}`, {
        data: {
            bidCode: context.bidCode,
            currentPage: context.page,
            pageSize: 40
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }else{
        Toast.info(res.message, 2)
    }
}

//  新宜贷还款记录
const xydPayRecord = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/finances/xyd-repayment/${context.bidCode}`, {
        data: {
            bidCode: context.bidCode,
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }
}

// 邀请好友时间
const inviteActivityTime = async (context) => {
    let param = {
            method : 'GET',
            headers:{
                "Accept": "application/json;charset=UTF-8",
                "clientId": "XXD_ACTIVITY_H5_PAGE",
                "clientTime": new Date().getTime(),
                "contentType": "application/json"
            },
            credentials: 'include'
    }
    const res = await fetch(`${urlPath}/activityCenter/anniversary6th/activityStatus`, param)
            return res.json()
}




export default { 
    hotFinancial,
    hotFinancialOther,
    financialDetail,
    financialJoinRecord,
    creditList,
    userAccount,
    getNewBid,
    newBidRecord,
    packageCanUser,
    financialBuy,
    getSign,
    getCost,
    getLoanInfo,
    getEachNew,
    investmentXyd,
    xydRecord,
    xydPayRecord,
    inviteActivityTime
}