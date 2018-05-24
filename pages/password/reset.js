import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../components/header/index'
import { Toast } from 'antd-mobile'
import Api from '../../components/api/home'
import md5 from 'md5'
import { onFocus, onBlur } from '../../common/Util'

export default class Reset extends Component {
    constructor(props) {
        super(props)
        this.state = {
            newPassword: '',
            repeatPassword: ''
        }
    }
    componentDidMount() {
        // console.log(this.props)
    }
    change = key => (e) => {
        var reg = /^[0-9a-zA-Z]+$/
        if(!reg.test(e.target.value)){
            if(e.target.value != '') return
        }
        this.setState({
            [key]: e.target.value
        })
    }
    submitReset = async () => {
        const passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
        if(this.state.newPassword == ''){
            Toast.info('请输入新密码', 2)
            this.refs.newPassword.focus()
            return
        }else if(!passwordReg.test(this.state.newPassword)){
            Toast.info('密码应为6-16位数字与字母组合', 2)
            this.refs.newPassword.focus()
            return
        }else if(this.state.repeatPassword == ''){
            Toast.info('请再次输入密码', 2)
            this.refs.repeatPassword.focus()
            return
        }else if(this.state.newPassword != this.state.repeatPassword){
            Toast.info('两次输入密码不一致', 2)
            this.refs.repeatPassword.focus()
            return
        }

        const { phone, smsCode } = this.props.url.query

        const context = {
            phone: phone,
            password: md5(md5(this.state.newPassword)),
            smsCode: smsCode
        }

        const res = await Api.resetPwd(context)
        const isLogin = await Api.isLogin()

        if(res.code != 0){
            Toast.info(res.message, 2)
        }else{
            Toast.info(res.message, 2)
            if(isLogin){
                setTimeout(()=> {
                    location = '/mypurse/personal'
                }, 2000)
            }else{
                setTimeout(()=> {
                    location = '/login'
                }, 2000)
            }
            
        }
    }
    render() {
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/password/_.css" />
                </Head>
                <div className="reset-box">
                    <Header title="重置登录密码" dmp={ true } dev_id="D4.3-1" eventtype="jump" />
                    <div className="reset-container">
                        <div className="input-wrapper">
                            <div className="div-input-wrapper">
                                <p className="input-tit">新密码</p>
                                <div className="div-input-border">
                                    <input className="dmp-click" dev_id="D4.3-2" dmp_action="write" eventtype="any_value" type="password" ref="newPassword" onFocus={ onFocus() } onBlur={ onBlur('6-16位数字+字母') } placeholder="6-16位数字+字母" value={ this.state.newPassword } onChange={ this.change('newPassword') } />
                                </div>
                            </div>
                            <div className="div-input-wrapper">
                                <p className="input-tit">确认密码</p>
                                <div className="div-input-border">
                                    <input className="dmp-click" dev_id="D4.3-3" dmp_action="write" eventtype="any_value" type="password" ref="repeatPassword" onFocus={ onFocus() } onBlur={ onBlur('再次输入新密码') } placeholder="再次输入新密码" value={ this.state.repeatPassword } onChange={ this.change('repeatPassword') } />
                                </div>
                            </div>
                            <div className="div-btn mt-45">
                                <button className="next-btn dmp-click" dev_id="D4.3-4" eventtype="jump" disabled={ this.state.newPassword != '' && this.state.repeatPassword != '' ? false : true } onClick={ this.submitReset }>提交设置</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}