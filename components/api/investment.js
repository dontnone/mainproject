import { cFetch } from '../../common/Promise'
import { Toast, Modal } from 'antd-mobile'
import urlPath from './url'

/**
 * 
 * @param {出借记录接口列表} 
 * { investRecord } : 出借记录
 * { onlyInvestRecord } : 单个产品出借记录
 */

//  出借记录列表
const myInvestRecord = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/investments/my-products`, {
        data: {
            page: context.page,
            pageSize: 20,
            type: context.type,
            code: context.code,
            productCode: context.productCode
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }else{
        Toast.info(res.message, 2)
    }
}

//  单个产品出借记录
const onlyInvestRecord = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/investments/product`, {
        data: {
            page: context.page,
            pageSize: 20,
            type: context.type,
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

//  日日盈出借记录
const rryInvestRecord = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/investments/rry`, {
        data: {
            page: context.page,
            pageSize: 20,
            status: "all",
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }else{
        Toast.info(res.message, 2)
    }
}



//  获取出借记录匹配债券列表
const investmentCreditList = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/investments/match-record/${context.id}`, {
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

export default { 
    myInvestRecord,
    onlyInvestRecord,
    rryInvestRecord,
    investmentCreditList
}