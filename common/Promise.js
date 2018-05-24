import fetch from 'isomorphic-fetch'
require('es6-promise').polyfill();
import { getCookie } from './Util'
import { Toast } from 'antd-mobile'
import { setTimeout } from 'timers';
import Router from 'next/router'
import cookie from 'cookie'

var window = (function () {
    if (typeof self !== 'undefined') { return self; }
    if (typeof window !== 'undefined') { return window; }
    if (typeof global !== 'undefined') { return global; }
    throw new Error('unable to locate global object');
})();

function parseCookies(context = {}) {
    return cookie.parse(
      context.req && context.req.headers.cookie
        ? context.req.headers.cookie
        : 'userToken:""'
    )
}

// global.document = new JSDOM(html).window.document;
  
/**
 * 
 * @param {*} url     请求的url地址
 * @param {*} params  同jq的参数对象 { type: 'get', data: {}, isServerTime: true }
 * @param {*} type 
 */
export async function cFetch(url, params){ 
    
    let str = ''; 
    let type = params.type || 'GET'
    let currentTime = new Date().getTime()
    if(params.isServerTime !== false){
        await fetch('/feapi/currentTime').then((res)=> {
            if(res.ok){
                res.json().then((data)=> {  
                    console.log(data)
                    currentTime =  data.currentTime
                }) 
            }
        })
    }
    let jsonParam = {
        method : type,
        headers:{
            "token": getCookie('userToken') || '',
            "Accept": "application/json",
            "clientId": "XXD_FRONT_END_H5",
            "clientTime": currentTime || new Date().getTime()
        },
        credentials: 'include'
    }
    if(params.ctx){
        jsonParam.headers['User-Agent'] = params.ctx.req.headers['user-agent']
        jsonParam.headers['token'] = parseCookies(params.ctx).userToken
    }
    // 专门判断是否表单提交
    if(params.contentType != 'multipart/form-data'){
        jsonParam.headers['Content-Type'] = params.contentType || 'application/json;charset=utf-8'
    }

    const dataParam = params.data
    if(type == 'GET' || type == 'PATCH'){
        if(typeof dataParam === 'object' && dataParam){  
            str += '?';  
            Object.keys(dataParam).forEach(function(val){  
                str += val + '=' + encodeURIComponent(dataParam[val]) + '&'; 
            })  
        }  
    }else {
        // 判断如果不是get，是否是form表单提交
        if(params.contentType){
            if(params.contentType == 'multipart/form-data'){
                jsonParam.body = dataParam
            }else{
                var formParams = ''
                Object.keys(dataParam).forEach(function(val){  
                    formParams += val + '=' + encodeURIComponent(dataParam[val]) + '&'; 
                }) 
                jsonParam.body = formParams
            }
        }else{
            // 不是form表单提交
            str = ''
            jsonParam.body = JSON.stringify(dataParam)
        }
    }
    return new Promise((resolve, reject)=> {
        fetch(url + str, jsonParam).then(function(res){
            if(res.ok){  
                res.json().then(function(data){  
                    if(url.indexOf('login-status') == -1 && data.code >= 200300 && data.code < 200400){
                        if(window.location.pathname == '/home' || window.location.pathname == '/financial'){
                            resolve(data); 
                            return
                        }
                        if(url.indexOf('beInLogging') != -1){
                            resolve(data); 
                            return
                        }
                        Toast.info('请先登录', 1)
                        if(window.location.href.indexOf('financial') != -1){
                            sessionStorage.setItem('loginType', window.location.href)
                        }else{
                            sessionStorage.setItem('loginType', '/mypurse')
                        }
                        setTimeout(()=> {
                            location.replace('/login')
                        }, 1000)
                    }else{
                        resolve(data); 
                    }
                })  
            }else{  
                console.log('请求失败'); 
                Toast.hide();
                setTimeout(()=> {
                    Toast.info('请求异常', 2)
                    reject();  
                }, 2000)
            }  
        }, function(e){  
            Toast.info('请求异常', 2)
            setTimeout(()=> {
                Toast.hide();
                reject();  
            }, 2000)
            console.log('请求失败');  
        }) 
    })
}  