import React, { Component } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { Toast } from 'antd-mobile'
import Header from '../../components/header/index'
import Api from '../../components/api/home'
import md5 from 'md5'
import Cookies from 'js-cookie'
import { delCookie, clearAllCookie, onFocus, onBlur } from '../../common/Util'

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
    componentDidMount() {
        delCookie('userToken')
        clearAllCookie()
        Cookies.remove('userToken');
    }
    change = key => (e) => {
        if(key == 'password'){
            var reg = /^[0-9a-zA-Z]+$/
            if(!reg.test(e.target.value)){
                if(e.target.value != '') return
            }
        }
        this.setState({
            [key]: e.target.value
        })
    }
    clear = () => {
        this.setState({
            username: ''
        })
    }
    login = async () => {
        const reg = /^[1][3,4,5,7,8][0-9]{9}$/
        if(this.state.username == '') {
            Toast.info('请输入登录账号', 2)
            this.refs.username.focus()
            return
        }else if(this.state.password == ''){
            Toast.info('请输入密码', 2)
            this.refs.password.focus()
            return
        }else if(this.state.password.length < 6 || this.state.password.length > 16 ){
            Toast.info('请输入正确的密码', 2)
            this.refs.password.focus()
            return
        }

        await delCookie('userToken')

        const context = {
            userName: this.state.username,
            password: md5(md5(this.state.password))
        }

        const res = await Api.userLogin(context)

        if(res.code !=0 ){
            Toast.info(res.message, 2)
        }else{
            Toast.info('登录成功', 2)
            setTimeout(()=> {
                location = sessionStorage.getItem('loginType') ? sessionStorage.getItem('loginType') : '/home'
                // window.location.href = sessionStorage.getItem('loginType') ? sessionStorage.getItem('loginType') : '/home'
            }, 2000)
        }

    }
    passwordShow = () => {
        this.setState({
            passwordShow: !this.state.passwordShow
        })
        if(this.state.type == 'password'){
            this.setState({
                type: 'text'
            })
        }else{
            this.setState({
                type: 'password'
            })
        }
    }
    render() {
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/login/_.css" />
                </Head>
                <div className="login-box">
                    <Header title="登录新新贷" dmp={ true } dev_id="C1.1-1" eventtype="jump" />
                    <div className="register-container login-container">
                        <div className="div-logo"></div>
                        <div className="input-wrapper">
                            <div className="div-input-border">
                                <span className="input-left-icon phone-number-icon"></span>
                                <input type="text" ref='username' value={ this.state.username } onFocus={ onFocus() } onBlur={ onBlur('请输入您的手机号/邮箱/用户名') } onChange={ this.change('username') } className="phone-number-input dmp-click" dev_id="C1.1-2" dmp_action="write" eventtype="any_value" placeholder="请输入您的手机号/邮箱/用户名" />
                                <span className={ this.state.username == '' ? 'input-right-img cancel-img hide' : 'input-right-img cancel-img' } onClick={ this.clear }></span>
                            </div>
                            <div className="div-input-border">
                                <span className="input-left-icon psw-icon"></span>
                                <input type={ this.state.type } className="dmp-click" dev_id="C1.1-4" dmp_action="write" eventtype="any_value" ref='password' onFocus={ onFocus() } onBlur={ onBlur('请输入您的密码') } placeholder="请输入您的密码" value={ this.state.password } onChange={ this.change('password') } />
                                <span className={ this.state.passwordShow ? 'input-right-img eye-img dmp-click' : 'input-right-img eye-open-img dmp-click' } dev_id="C1.1-5" eventtype={ this.state.passwordShow ? 'off' : 'on' } onClick={ this.passwordShow }></span>
                            </div>
                            <div className="div-login-button">
                                <button type="button" className="dmp-click" dev_id="C1.1-6" eventtype="jump" onClick={ this.login }>登录</button>
                            </div>
                            <div className="div-link">
                                <a href="/register" dev_id="C1.1-7" eventtype="jump" className="register-link dmp-click">快速注册</a>
                                <a href="/password" dev_id="C1.1-8" eventtype="jump" className="forget-psw dmp-click">忘记密码</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}