import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../components/header/index'
import Api from '../../components/api/home'
import userInfo from '../../components/api/purse'
import { Toast, Modal } from 'antd-mobile'
import { phoneSpace, onFocus, onBlur } from '../../common/Util'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfo: {},
            phone: '',
            seqPhone: '',
            textDisabled: false,
            imgModal: false,
            imgUrl: '/userCenter/kaptcha.jpg',
            imgCode: '',
            smsCode:'',
            messageState: 'sms',
            sendTextCode: '发送验证码'
        }
    }
    async componentDidMount() {
        const res = await userInfo.userInfo()
        Toast.hide()
        this.setState({
            userInfo: res,
            phone: res.mobile,
            seqPhone: phoneSpace(res.mobile)
        })
    }
    change = (e) =>{
        if(e.target.value.length > 4){
            return
        }
        this.setState({
            smsCode: e.target.value
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
                phone: this.state.phone,
                type: '2',
                scene: '2',
                busiCode: 'CHANGE_USER_PASSWORD'
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
    // 点击发送按钮
    sendMsg = key => async () => {
        const _this = this
        let states = key == 'sendMessage' ? 'sms' : 'voice'
        if(!this.state.textDisabled ){
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
    next = async () => {

        if(this.state.smsCode == ''){
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
                    <Header title="重置登录密码" dmp={ true } dev_id="D4.2-1" eventtype="jump" />
                    <div className="reset-container">
                        <div className="input-wrapper">
                            <div className="div-phone-number">
                                <p className="txt">为了您的账号安全，需要验证您的手机号</p>
                                <p className="phone-num">{ this.state.seqPhone }</p>
                            </div>
                            <div className="div-input-border mb-0">
                                <input type="text" className="dmp-click" dev_id="D4.2-2" dmp_action="write" eventtype="open_float_window" value={ this.state.smsCode } onChange={ this.change } onFocus={ onFocus() } onBlur={ onBlur('请输入验证码') } placeholder="请输入验证码" />
                                <div className="input-right-btn">
                                    <button type="button" className="dmp-click" dev_id="D4.2-3" eventtype="to_inactive" disabled={ this.state.textDisabled } onClick={ this.sendMsg('sendMessage') }>{this.state.sendTextCode}</button>
                                </div>
                            </div>
                            <div className="div-link"><a className={ this.state.textDisabled ? 'gray' : 'dmp-click' } dev_id="D4.2-4" eventtype="to_inactive" onClick={ this.sendMsg('sendVoice') }>语音验证码</a></div>
                            <div className="div-btn mt-45">
                                <button className="next-btn dmp-click" dev_id="D4.2-5" eventtype="jump" disabled={ this.state.phone != '' && this.state.smsCode != '' ? false : true } onClick={ this.next }>下一步</button>
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