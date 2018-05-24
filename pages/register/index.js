import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../components/header/index'
import Link from 'next/link'
import Api from '../../components/api/home'
import md5 from 'md5'

import { Toast, Modal, Button } from 'antd-mobile'
import { cFetch } from '../../common/Promise';

import { onFocus, onBlur, getCookie } from '../../common/Util'

export default class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: '',
            imgUrl: '/userCenter/kaptcha.jpg',
            imgCode: '',
            imgModal: false,
            messageState: 'sms',
            sendTextCode: '发送验证码',
            textDisabled: false,
            smsCode: '',
            inputType: 'password',
            passwordShow: true,
            password: '',
            protocol: true
        }
    }
    change = key => (e) => {
        if(key == 'username' && e.target.value.length > 11){
            return
        }
        if(key == 'smsCode' && e.target.value.length > 4){
            return
        }
        if(key == 'password'){
            var reg = /^[0-9a-zA_Z]+$/
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
    onClose = key => () => {
        this.setState({
            [key]: false,
        });
    }
    // 验证图片验证码格式
    imgChange = (e) => {
        var reg = /^[0-9a-zA-Z]+$/
        if(!reg.test(e.target.value)){
            if(e.target.value != '') return
        }
        if(e.target.value.length > 4){
            return
        }
        this.setState({
            imgCode: e.target.value
        })
    }
    // 重置图片验证码
    reset = () => {
        this.setState({
            imgUrl: this.state.imgUrl + '?t=' + Math.random()
        })
    }
    // 发送验证请求
    sendImgCode = async () => {
        if(this.state.imgCode == ''){
            Toast.info('请输入图片验证码', 2)
            this.setState({
                imgUrl: this.state.imgUrl + '?t=' + Math.random()
            })
            return
        }else if(this.state.imgCode.length != 4){
            Toast.info('您的图片验证码不正确', 2)
            this.setState({
                imgUrl: this.state.imgUrl + '?t=' + Math.random()
            })
            return
        }else {
            const context = {
                imgcode: this.state.imgCode,
                phone: this.state.username,
                type: '0',
                scene: '',
                busiCode: 'BUSICODE_REGISTER'
            }
            let res = {}
            if(this.state.messageState == 'sms'){
                res = await Api.sendTextMessage(context)
            }else{
                res = await Api.sendVoiceMessage(context)
            }
            if(res.code != 0){
                Toast.info(res.message, 2)
                this.setState({
                    imgUrl: this.state.imgUrl + '?t=' + Math.random()
                })
            }else{
                Toast.info(res.message, 2)
                this.setState({
                    imgModal: false,
                    imgCode: ''
                })
                this.setState({
                    sendTextCode: '60s后重新发送',
                    textDisabled: true
                })
                let time = 60
                let timeInterval =  setInterval(()=> {
                    time--
                    this.setState({
                        sendTextCode: time + 's后重新发送',
                        textDisabled: true
                    })
                    if(time == 0){
                        window.clearInterval(timeInterval)
                        this.setState({
                            sendTextCode: '发送验证码',
                            textDisabled: false
                        })
                    }
                },1000)
            }
        }
    }
    // 点击发送按钮
    sendMsg = key => async () => {
        const _this = this
        const reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
        let states = key == 'sendMessage' ? 'sms' : 'voice'
        if(!this.state.textDisabled ){
            // 验证是否为空
            if(this.state.username == ''){
                Toast.info('请输入您的手机号', 2)
                return
            }
            // 验证格式是否正确
            
            if(!reg.test(this.state.username)){
                debugger
                Toast.info('手机号码格式错误', 2)
                return
            }

            const context = {
                phone: this.state.username
            }

            const unique = await Api.checkUnique(context)
            
            if(unique.code != 0){
                Toast.info(unique.message, 2)
                return
            }

            this.setState({
                imgCode: '',
                imgModal: true,
                messageState: states
            })
        }
    }
    passwordShow = () => {
        this.setState({
            passwordShow: !this.state.passwordShow
        })
        if(this.state.inputType == 'password'){
            this.setState({
                inputType: 'text'
            })
        }else{
            this.setState({
                inputType: 'password'
            })
        }
    }
    agreenProtocol = () => {
        this.setState({
            protocol: !this.state.protocol
        })
    }
    register = async () => {
        const reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
        const passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/
        if(this.state.username == ''){
            Toast.info('请输入您的手机号', 2)
            return
        }else if(!reg.test(this.state.username)){
            Toast.info('手机号码格式错误', 2)
            return
        }else if(this.state.smsCode == ''){
            Toast.info('请输入验证码', 2)
            return
        }else if(this.state.smsCode.length < 4){
            Toast.info('您的验证码不正确', 2)
            return
        }else if(this.state.password == ''){
            Toast.info('请设置登录密码', 2)
            return
        }else if(!passwordReg.test(this.state.password)){
            Toast.info('密码应为6-16位数字与字母组合', 2)
            return
        }else if(!this.state.protocol){
            Toast.info('注册前需同意《新新贷注册协议》、《资金出借风险提示函》', 2)
            return
        }
        const context = {
            password: md5(md5(this.state.password)),
            phone: this.state.username,
            channel: getCookie('dmp_utm_source') || '',
            smsCode: this.state.smsCode
        }
        const res = await Api.userRegister(context)
        if(res.code != 0){
            Toast.info(res.message, 2)
        }else{
            // Toast.info('注册成功', 2)
            window.location.href = '/register/success'
        }
    }
    render() {
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/register/_.css" />
                </Head>
                <div className="register-box">
                    <Header title="注册新账号" dmp={ true } dev_id="B2.1-1" eventtype="jump" />
                    <div className="register-container">
                        <div className="input-wrapper">
                            <div className="div-input-border">
                                <span className="input-left-icon phone-number-icon"></span>
                                <input type="number" className="phone-number-input dmp-click" dev_id="B2.1-3.2" dmp_action="write" eventtype="any_value" value={ this.state.username } onChange={ this.change('username') } onFocus={ onFocus() } onBlur={ onBlur('请输入您的手机号') } placeholder="请输入您的手机号" />
                                <span className={ this.state.username == '' ? 'input-right-img cancel-img hide' : 'input-right-img cancel-img' } onClick={ this.clear }></span>
                            </div>
                            <div className="div-input-border mb-0">
                                <span className="input-left-icon code-icon"></span>
                                <input className="dmp-click" dev_id="B2.1-3.3.2" dmp_action="write" eventtype="any_value" type="text" onFocus={ onFocus() } onBlur={ onBlur('请输入验证码') } placeholder="请输入验证码" value={ this.state.smsCode } onChange={ this.change('smsCode') } />
                                <div className="code-btn">
                                    <button className="send-code-btn dmp-click" dev_id="B2.1-3.3.3" eventtype="to_inactive" disabled={ this.state.textDisabled } onClick={ this.sendMsg('sendMessage') }>{this.state.sendTextCode}</button>
                                </div>
                            </div>
                            <div className="div-link"><a className={ this.state.textDisabled ? 'gray' : 'dmp-click' } dev_id="B2.1-3.3.4" eventtype="to_inactive" onClick={ this.sendMsg('sendVoice') }>语音验证码</a></div>
                            <div className="div-input-border"> 
                                <span className="input-left-icon psw-icon"></span>
                                <input type={this.state.inputType} className="dmp-click" dev_id="B2.1-3.3.5.2" dmp_action="write" eventtype="any_value" onFocus={ onFocus() } onBlur={ onBlur('设置登录密码（6-16位字母+数字)') } placeholder="设置登录密码（6-16位字母+数字)" value={ this.state.password } onChange={ this.change('password') } />
                                <span className={ this.state.passwordShow ? 'input-right-img eye-img eye-img dmp-click' : 'input-right-img eye-img eye-open-img dmp-click' } dev_id="B2.1-3.3.5.3" eventtype={ this.state.passwordShow ? 'on' : 'off' } onClick={ this.passwordShow }></span>
                            </div>
                            <div className="div-checkbox">
                                <label forhtml="" className="dmp-click" dev_id="B2.1-3.3.5.4" eventtype={ this.state.protocol ? 'off' : 'on' } onClick={ this.agreenProtocol }>
                                    <span className={ this.state.protocol ? 'checkbox checked dmp-click' : 'checkbox dmp-click' } dev_id="B2.1-3.3.5.4" eventtype={ this.state.protocol ? 'off' : 'on' }></span>
                                    <input className="dmp-click" dev_id="B2.1-3.3.5.4" eventtype={ this.state.protocol ? 'off' : 'on' } type="checkbox" defaultChecked />
                                </label>
                                <div className="agreement">
                                    我已阅读并同意<a href="/modal/agreement">《新新贷注册使用协议》、</a><a href="/modal/risk">《资金出借风险提示函》</a>
                                </div>
                            </div>
                            <div className="div-button">
                                <button type="button" onClick={ this.register }>注册</button>
                            </div>
                            <div className="div-login">
                                已是新新贷会员，<a href="/login" className="dmp-click" dev_id="B2.1-1.1" eventtype="jump">马上登录</a>
                            </div>
                        </div>
                        <div className="tips">
                            <div className="img-block"></div>
                            <p>新新贷已接入银行存管</p>
                        </div>
                    </div>
                </div>
                <Modal
                    key={ () => Math.random() }
                    visible={this.state.imgModal}
                    transparent
                    maskClosable={false}
                    onClose={this.onClose('imgModal')}
                    title="请输入验证码"
                    footer={[{ text: '取消', onPress: () => { console.log('chanel'); this.onClose('imgModal')(); }},{ text: '确定', onPress:  this.sendImgCode  }]}
                >
                <div className="phoneCode">
                    <input type="text" onFocus={ onFocus() } onBlur={ onBlur('输入验证码') } placeholder="输入验证码" value={ this.state.imgCode } onChange={ this.imgChange } /><img src={this.state.imgUrl} onClick={ this.reset } />
                </div>
                </Modal>
            </div>
        )
    }
}