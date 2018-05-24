import { cFetch } from '../../common/Promise'
import { Toast, Modal } from 'antd-mobile'
import urlPath from './url'

//  用户信息
const userInfo = async (ctx) => {
    // Toast.loading('加载中……', 0)
    const res = await cFetch(`${urlPath}/apih5/api/users/info`, {
        data: {},
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }
}

//  消息通知
const messageInfo = async () => {
    const res = await cFetch(`${urlPath}/apih5/api/messages/unread-count`, {
        data: {},
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }else{
        Toast.info(res.message, 2)
    }
}

//  公告消息列表
const noticeList = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/messages/notice`, {
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
//  公告消息详情
const noticeInfo = async (id) => {
    const res = await cFetch(`${urlPath}/apih5/api/messages/notice/${id}`, {
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

//  公告消息单条设置已读
const readNoticeInfo = async (id) => {
    const res = await cFetch(`${urlPath}/apih5/api/messages/notice/${id}`, {
        type: 'PUT',
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

//  系统消息列表
const systermInfoList = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/messages/system`, {
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

//  系统消息设置已读
const systermRead = async (id) => {
    const res = await cFetch(`${urlPath}/apih5/api/messages/system/${id}`, {
        type: 'PUT',
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

//  批量设置已读
const allRead = async (type) => {
    const res = await cFetch(`${urlPath}/apih5/api/messages`, {
        type: 'PATCH',
        data: {
            type: type
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }else{
        Toast.info(res.message, 2)
    }
}

//  实名认证
const realUserToken = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/accounts/approve`, {
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: {
            realName: context.realName,
            idCardNumber: context.idCardNumber,
            cardType: 1
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }else{
        Toast.info(res.message, 2)
    }
}

// 充值初始化信息
const rechargeInit = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/assets/recharge/init`, {
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

// 充值
const recharge = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/assets/recharge`, {
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: {
            rechargeType: 14,
            rechargeAmount: context.rechargeAmount
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }else{
        Toast.info(res.message, 2)
    }
}

//  用户已开户获取用户信息
const userAccounts = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/accounts`, {
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

//  人工实名审核
const userExamine = async (context) => {
    const formdata = new FormData()
    for(let name in context){
        formdata.append(name, context[name])
    }
    const res = await cFetch(`${urlPath}/apih5/api/accounts/approve/manual`, {
        type: 'POST',
        contentType: 'multipart/form-data',
        data: formdata,
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }else{
        Toast.info(res.message, 2)
    }
}

//  富友跳转
const fuyouJump = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/accounts/fuyou`, {
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

//  获取风险评测问题
const getRiskExam = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/more/risk-exam`, {
        data: {
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }
}

//  提交风险评测问题
const submitRisk = async (context) => {
    Toast.loading('加载中……', 0)
    const res = await cFetch(`${urlPath}/apih5/api/more/risk-exam`, {
        type: 'PUT',
        contentType: 'application/x-www-form-urlencoded',
        data: {
            data: JSON.stringify({
                answers: context.answers,
                ip: context.ip
            })
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }else{
        Toast.hide()
        Toast.info(res.message, 2)
    }
}

//  获取风险评测结果
const resultRisk = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/more/risk-exam/result`, {
        data: {
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }
}

//  绑定财富顾问接口列表
const bindAssistant = async (context) => {
    const res = await cFetch(`${urlPath}/v5_mobile/mobile/personal/vipQueryService.html`, {
        data: {
        },
        isServerTime: false
    })
    if(res){
        return res
    }
}

//  绑定财富顾问提交
const submitAssistant = async (context) => {
    const formdata = new FormData()
    for(let name in context){
        formdata.append(name, context[name])
    }
    const res = await cFetch(`${urlPath}/v5_mobile/mobile/personal/vipApply.html`, {
        type: 'POST',
        contentType: 'multipart/form-data',
        data: formdata,
        isServerTime: false
    })
    if(res){
        return res
    }
}

//  意见反馈
const feedback = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/more/opinion`, {
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: {
            contract: context.contract,
            content: context.content
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res
    }
}

//  标的借款人信息
const bidPersonDetail = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/finances/bid/borrower/` + context.bidCode , {
        data: {
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }
}

//  步步高升退出记录
const stepOutRecord = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/investments/step/detail/` + context.joinId , {
        data: {
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }
}

//  新元宝加入记录
const newplanJoinRecord = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/investments/user-tender-detail/` + context.joinId , {
        data: {
            joinId: context.joinId,
            productType: context.productType,
            page: context.page,
            pageSize: '20'
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }
}

//  获取局域网的ip地址
const getBorrowIp = async (context) => {
    const res = await cFetch('http://httpbin.org/ip', {
        data: {
        },
        isServerTime: false
    })
    if(res){
        return res
    }
}



export default { 
    userInfo, 
    messageInfo, 
    noticeList, 
    noticeInfo, 
    readNoticeInfo,
    systermInfoList, 
    systermRead,
    allRead,
    realUserToken, 
    fuyouJump, 
    rechargeInit,
    recharge,
    userAccounts, 
    getRiskExam, 
    submitRisk, 
    resultRisk, 
    userExamine,
    bindAssistant,
    submitAssistant,
    feedback,
    bidPersonDetail,
    stepOutRecord,
    newplanJoinRecord,
    getBorrowIp
}