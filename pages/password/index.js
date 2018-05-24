import React, { Component } from 'react'
import Header from '../../components/header/index'
import Head from 'next/head'
import { Toast, Modal, Button } from 'antd-mobile'
import { onFocus, onBlur } from '../../common/Util'

import Api from '../../components/api/home'

export default class ForgetPassword extends Component {
    constructor(props) {
        super(props)
        this.state = {
            phone: '',
            textDisabled: false,
            imgModal: false,
            imgUrl: '/userCenter/kaptcha.jpg',
            imgCode: '',
            smsCode:'',
            messageState: 'sms',
            sendTextCode: '发送验证码'
        }
    }
    change = key => (e) =>{
        if(key == 'phone' && e.target.value.length > 11){
            return
        }
        if(key == 'smsCode' && e.target.value.length > 4){
            return
        }
        this.setState({
            [key]: e.target.value
        })
    }
    // 点击发送按钮
    sendMsg = key => async () => {
        const _this = this
        const reg = /^[1][3,4,5,7,8][0-9]{9}$/
        let states = key == 'sendMessage' ? 'sms' : 'voice'
        if(!this.state.textDisabled ){
            // 验证是否为空
            if(this.state.phone == ''){
                Toast.info('请输入您的手机号', 2)
                return
            }
            // 验证格式是否正确
            if(!reg.test(this.state.phone)){
                Toast.info('手机号码格式错误', 2)
                return
            }

            const context = {
                phone: this.state.phone
            }

            const unique = await Api.checkUnique(context)
    
            if(unique.code == 0){
                Toast.info('用户未注册，请先注册', 2)
                return
            }

            this.setState({
                imgCode: '',
                imgModal: true,
                messageState: states
            })
        }
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
                phone: this.state.phone,
                type: '1',
                scene: '',
                busiCode: 'BUSICODE_RETRIEVE_PASSWORD'
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
    onClose = key => () => {
        this.setState({
            [key]: false,
        });
    }
    next = async () => {
        
        const reg = /^[1][3,4,5,7,8][0-9]{9}$/
        if(this.state.phone == ''){
            Toast.info('请输入您的手机号', 2)
            return
        }else if(!reg.test(this.state.phone)){
            Toast.info('手机号码格式错误', 2)
            return
        }else if(this.state.smsCode == ''){
            Toast.info('请输入验证码', 2)
            return
        }else if(this.state.smsCode.length < 4){
            Toast.info('您的验证码不正确', 2)
            return
        }

        const context = {
            phone: this.state.phone,
            smsCode: this.state.smsCode
        }

        const unique = await Api.checkUnique(context)

        if(unique.code != 0){
            const res = await Api.smsCheck(context)
            if(res.code != 0){
                Toast.info(res.message, 2)
            }else{
                location = '/password/reset?phone=' + this.state.phone + '&smsCode=' + this.state.smsCode 
            }
        }else{
            Toast.info('手机号未被注册', 2)
        }
    }
    render() {
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/password/_.css" />
                </Head>
                <div className="reset-box">
                    <Header title="重置登录密码" />
                    <div className="reset-container">
                        <div className="input-wrapper">
                            <div className="div-input-border">
                                <input type="number" onFocus={ onFocus() } onBlur={ onBlur('请输入手机号') } placeholder="请输入手机号" value={ this.state.phone } onChange={ this.change('phone') } />
                            </div>
                            <div className="div-input-border mb-0">
                                <input type="text" onFocus={ onFocus() } onBlur={ onBlur('请输入验证码') } placeholder="请输入验证码" value={ this.state.smsCode } onChange={ this.change('smsCode') } />
                                <div className="input-right-btn">
                                    <button type="button" disabled={ this.state.textDisabled } onClick={ this.sendMsg('sendMessage') }>{this.state.sendTextCode}</button>
                                </div>
                            </div>
                            <div className="div-link"><span className="tips">如未绑定手机号，请联系客服 <a href="tel:4000169521">4000-169-521</a></span><a className={ this.state.textDisabled ? 'gray' : '' } onClick={ this.sendMsg('sendVoice') }>语音验证码</a></div>
                            <div className="div-btn">
                                <button className="next-btn" disabled={ this.state.phone != '' && this.state.smsCode != '' ? false : true } onClick={ this.next }>下一步</button>
                            </div>
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