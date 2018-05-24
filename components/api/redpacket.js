import { cFetch } from '../../common/Promise'
import { Toast, Modal } from 'antd-mobile'
import urlPath from './url'

/**
 * 
 * @param {优惠券／新新币接口列表}
 * 
 * { redpacketBind } : 绑定优惠券
 * { redpacketList } : 优惠券列表
 * { xxbInfo } : 账户新新币初始信息
 * { xxbExcahnge } : 账户新新币兑换
 * { xxbRecord } : 新新币兑换记录
 *  
 */

//  红包绑定
const redpacketBind = async (code) => {
    const res = await cFetch(`${urlPath}/apih5/api/coupons/exchange`, {
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: {
            couponCode: code
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }else{
        Toast.info(res.message, 2)
    }
}

//  红包查询
const redpacketNum= async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/myReward`, {
        data: {
            status: 0,
            page: 1,
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

//  新手红包列表
const newRedpacketList= async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/red-envelope`, {
        data: {
            status: 0,
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

//  红包列表
const redpacketList= async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/rate-coupons`, {
        data: {
            type: context.type,
            status: context.status,
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

// //  红包列表
// const redpacketList= async (context) => {
//     const res = await cFetch(`${urlPath}/apih5/api/red-packages`, {
//         data: {
//             status: context.status,
//             page: context.page,
//             pageSize: 20
//         },
//         isServerTime: false
//     })
//     if(res.code == '200000'){
//         return res.data
//     }else{
//         Toast.info(res.message, 2)
//     }
// }

//  账户新新币信息
const xxbInfo= async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/coins`, {
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

//  账户新新币兑换
const xxbExcahnge= async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/coins/exchange`, {
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: {
            coinNum: context.coinNum
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }else{
        Toast.info(res.message, 2)
    }
}

//  账户新新币兑换记录
const xxbRecord= async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/coins/trade`, {
        data: {
            page: context.page,
            pageSize: 20,
            type: context.type
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }else{
        Toast.info(res.message, 2)
    }
}

export default { 
    redpacketNum,
    newRedpacketList,
    redpacketBind,
    redpacketList,
    xxbInfo,
    xxbExcahnge,
    xxbRecord
}