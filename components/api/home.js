import { cFetch } from '../../common/Promise'
import { Toast, Modal } from 'antd-mobile'
import { setTimeout } from 'timers';
import urlPath from './url'

/**
 * 
 * @param {首页／登陆／注册／短信等用户相关接口列表} 
 * { homeServer } : 首页获取初始数据
 * { isLogin } : 判断用户是否登陆
 * { sendTextMessage } : 发送文字短信接口
 * { sendVoiceMessage } : 发送语音短信接口
 * { userLogin } : 登陆
 * { userRegister } : 注册
 * { smsCheck } : 预检查短信接口
 * { checkUnique } : 验证用户唯一性
 * { resetPwd } : 重置用户登陆密码
 * { redPackage } : 注册成功之后的红包页面 
 *
 */

//  首页
const homeServer = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/homes`, {
        data: {},
        isServerTime: false
    })
    if(res.code == '200000'){
        return res
    }else{
        Toast.info(res.message, 2)
    }
}

//  判断用户是否登陆
const isLogin = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/users/login-status`, {
        data: {},
        isServerTime: false
    })
    if(res.code == '200000'){
        return true
    }else{
        return false
    }
}


//  发送文字短信接口
const sendTextMessage = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/sms/send-message`, {
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: {
            imgcode: context.imgcode,
            phone: context.phone,
            type: context.type,
            scene: context.scene
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }
}

//  发送语音短信接口
const sendVoiceMessage = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/sms/send-voice`, {
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: {
            imgcode: context.imgcode,
            phone: context.phone,
            busiCode: context.busiCode
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }
}

// 登陆
const userLogin = async (context) => {
    Toast.loading('登录中……', 0)
    const res = await cFetch(`${urlPath}/apih5/api/users/login`, {
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: {
            userName: context.userName,
            password: context.password
        },
        isServerTime: false
    })
    if(res && res.code == '200000'){
        Toast.hide()
        return res.data
    }else{
        Toast.info('登录异常', 2)
        setTimeout(()=> {
            Toast.hide()
        })
    }
}

//  注册
const userRegister = async (context) => {
    Toast.loading('请稍后……', 0)
    const res = await cFetch(`${urlPath}/apih5/api/users/register`, {
        type: 'POST',
        contentType: 'application/x-www-form-urlencoded',
        data: {
            channel: context.channel,
            password: context.password,
            phone: context.phone,
            smsCode: context.smsCode,
            // 注册用户属性  1 为出借人 2 为借款人
            userAttr: context.userAttr|| 1
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        Toast.hide()
        return res.data
    }else{
        Toast.hide()
        setTimeout(()=>{
            Toast.info(res.message, 2)
        }, 200)
    }
}


// 新宜贷注册渠道统计

const userRegisterSourceSave = async (context)=>{
    const res= await cFetch(`${urlPath}/activityCenter/userSource/save`,{
        type:'post',
        data:{
            data:{
                mobile: context.mobile,
                utmsource: context.utmsource,
                userid:context.userid
            }
        },
        isServerTime:false
    })
    if(res.code =='200000'){
        return res.data;
    }else{
        return res.data;
    }
}





//  预检查短信接口
const smsCheck = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/sms/check`, {
        data: {
            phone: context.phone,
            smsCode: context.smsCode
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }
}

//  验证用户唯一性
const checkUnique = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/users/check/unique`, {
        data: {
            username: context.phone
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }
}

//  重置用户登陆密码
const resetPwd = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/password/reset`, {
        type: 'PUT',
        contentType: 'application/x-www-form-urlencoded',
        data: {
            phone: context.phone,
            password: context.password,
            smsCode: context.smsCode
        },
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }
}

//  注册成功之后的红包页面
const redPackage = async (context) => {
    const res = await cFetch(`${urlPath}/apih5/api/red-packages/new`, {
        data: {},
        isServerTime: false
    })
    if(res.code == '200000'){
        return res.data
    }else{
        Toast.info(res.message, 2)
    }
}

export default { homeServer, isLogin, sendTextMessage, sendVoiceMessage, userLogin, userRegister, smsCheck, checkUnique, resetPwd, redPackage ,userRegisterSourceSave}