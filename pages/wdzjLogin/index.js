import React, { Component } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Toast } from 'antd-mobile'
import Header from '../../components/header/index'
import Cookies from 'js-cookie'
import fetch from 'isomorphic-fetch'
import urlPath from '../../components/api/url'
export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            password: '',
            type: 'password',
            passwordShow: true
        }
    }
    async componentDidMount() {



        function getQueryString(name) {
            var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
            var r = window.location.search.substr(1).match(reg);
            if (r != null) {
                return unescape(r[2]);
            }
            return null;
        }

        function setCookie(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
        }

        let auth = getQueryString('auth')
        const wdzjLogin = async (context) => {
            let param = {
                    method : 'POST',
                    headers:{
                        "Accept": "application/json;charset=UTF-8",
                        "clientId": "THIRDPARTY_WDZJ",
                        "clientTime": new Date().getTime(),
                        "contentType": "application/json"
                    },
                    data:{},
                    credentials: 'include'
            }
            const res = await fetch(`${urlPath}/userCenter/user/wdzj/rebate/wdzjLogin?auth=${auth}`, param)
           
                    return res.json()
        }

        
        let data = await wdzjLogin()
        if(data.code == 0){
            let userToken = JSON.stringify(data.Token)

            userToken = userToken.replace(/\"/g, "");
                            
            console.log(data.Token)
            setCookie('userToken' , userToken , 15)
        }
        let timer = setTimeout(()=>{
            window.location.href = '/home'
            clearTimeout(timer)
        },2000)
    }
    
    render() {
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/login/_.css" />
                </Head>
                <div className="wdzj-login-box">
                    跳转中...
                </div>
            </div>
        )
    }
}