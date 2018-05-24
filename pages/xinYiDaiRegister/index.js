import React, {Component} from 'react'
import Head from 'next/head'
import Header from '../../components/header/index'
import Link from 'next/link'
import Api from '../../components/api/home'
import md5 from 'md5'
import {Toast, Modal, Button} from 'antd-mobile'
import {cFetch} from '../../common/Promise';
import createBrowserHistory from "history/createBrowserHistory"

import {onFocus, onBlur, getCookie} from '../../common/Util'

export default class XinYiDaiRegister extends Component {
    constructor(props) {
        super(props)
        this.state = {
            phoneNum: '',
            imgUrl: '/userCenter/kaptcha.jpg',
            imgCode: '',
            imgModal: false,
            sendTextCode: '获取验证码',
            textDisabled: false,
            smsCode: '',
            password: '',
            showMain: false,
            utm_source:'',
            xydapp_utm_source:'',
            baseDownloadLink:'https://m.xinxindai.com/jie/download/manifest.html',
            downloadLink:'',
            urlSearch:'',
            applyInNode:{},
            showApplyIn:true
        }
    }
    componentDidMount() {
        window.onscroll=(event)=>{
            if(document.scrollingElement.scrollTop<340){
                this.setState({
                    showApplyIn:true
                });
            }else{
                this.setState({
                    showApplyIn:false
                });
            }
        };
      let  getQueryVariable=(variable)=> {
            var query = window.location.search.substring(1);
            var vars = query.split("&");
            for (var i=0;i<vars.length;i++) {
                var pair = vars[i].split("=");
                if(pair[0] == variable){return pair[1];}
            }
            return(false);
        }
       let utm_source= getQueryVariable('utm_source');
        let xydapp_utm_source= getQueryVariable('xydapp_utm_source');
        let downloadLink = window.location.search;
        this.setState({
            utm_source:utm_source,
            xydapp_utm_source:xydapp_utm_source,
            downloadLink:this.state.baseDownloadLink+downloadLink,
            urlSearch:downloadLink
        });
        // Listen for changes to the current location.
        let history = createBrowserHistory({
            basename: "", // The base URL of the app (see below)
            forceRefresh: false, // Set true to force full page refreshes
            keyLength: 6, // The length of location.key
            // A function to use to confirm navigation with the user (see below)
            getUserConfirmation: (message, callback) => callback(window.confirm(message))
        })
        this.setState({
            history: history
        });
        const unlisten = history.listen((location, action) => {
            /**
             * listen hisctory change ,and clean smscode , passwd
             */
            if (this.state.showMain == true) {
                this.setState({
                    showMain: false,
                    smsCode: '',
                    password: '',
                    imgModal: false
                });
            }
            ;
            if (action == 'POP' && '/xinYiDaiRegister') {
                this.state.history.push('/xinYiDaiRegister'+this.state.urlSearch);
            }
        });
    }
    change = key => (e) => {
        if (key == 'phoneNum' && e.target.value.length > 11) {
            return
        }
        if (key == 'smsCode' && e.target.value.length > 4) {
            return
        }
        if (key == 'password') {
            var reg = /^[0-9a-zA_Z]+$/
            if (!reg.test(e.target.value)) {
                let regNum = /^[0-9]+$/;
                let regCode = /^[a-zA-Z]+$/;
                if(!regNum.test(e.target.value)||!regCode.test(e.target.value)){
                    Toast.info('密码应为6-16位数字与字母组合', 1);
                }
                if (e.target.value != '') return
        }
        }
        this.setState({
            [key]: e.target.value
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
        if (!reg.test(e.target.value)) {
            if (e.target.value != '') return
        }
        if (e.target.value.length > 4) {
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
        if (this.state.imgCode == '') {
            Toast.info('请输入图片验证码', 2)
            this.setState({
                imgUrl: this.state.imgUrl + '?t=' + Math.random()
            })
            return
        } else if (this.state.imgCode.length != 4) {
            Toast.info('您的图片验证码不正确', 2)
            this.setState({
                imgUrl: this.state.imgUrl + '?t=' + Math.random()
            })
            return
        } else {
            const context = {
                imgcode: this.state.imgCode,
                phone: this.state.phoneNum,
                type: '0',
                scene: '',
                busiCode: 'BUSICODE_REGISTER'
            }
            let res = {}
            res = await Api.sendTextMessage(context)
            if (res.code != 0) {
                Toast.info(res.message, 2)
                this.setState({
                    imgUrl: this.state.imgUrl + '?t=' + Math.random()
                })
            } else {
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
                let timeInterval = setInterval(() => {
                    time--
                    this.setState({
                        sendTextCode: time + 's后重新发送',
                        textDisabled: true
                    })
                    if (time == 0) {
                        window.clearInterval(timeInterval)
                        this.setState({
                            sendTextCode: '发送验证码',
                            textDisabled: false
                        })
                    }
                }, 1000)
            }
        }
    }
    // 点击发送按钮
    sendMsg = key => async () => {
        const reg = /^[1][3,4,5,7,8,9][0-9]{9}$/
        let states = key == 'sendMessage' ? 'sms' : 'voice'
        if (!this.state.textDisabled) {
            // 验证是否为空
            if (this.state.phoneNum == '') {
                Toast.info('请输入您的手机号', 2)
                return
            }
            // 验证格式是否正确
            if (!reg.test(this.state.phoneNum)) {
                debugger
                Toast.info('手机号码格式错误', 2)
                return
            }
            const context = {
                phone: this.state.phoneNum
            }
            const unique = await Api.checkUnique(context)
            if (unique.code != 0) {
                Toast.info(unique.message, 2)
                return
            }
            this.setState({
                imgCode: '',
                imgModal: true
            })
        }
    }
    //click 我要申请
    applyIn = async () => {
        const reg = /^[1][3,4,5,7,8,9][0-9]{9}$/;

        if (this.state.phoneNum == '') {
            Toast.info('请输入您的手机号', 2);
            return;
        } else if (!reg.test(this.state.phoneNum)) {
            Toast.info('手机号码格式错误', 2);
            return;
        } else if (this.state.smsCode == '') {
            Toast.info('请输入验证码', 2);
            return;
        } else if (this.state.smsCode.length < 4) {
            Toast.info('您的验证码不正确', 2);
            return;
        }

        const context = {
            phone: this.state.phoneNum,
            smsCode: this.state.smsCode
        }
        const res = await Api.smsCheck(context)
        if (res.code != 0) {
            Toast.info(res.message, 2)
        } else {
            this.state.history.push('/xinYiDaiRegister'+this.state.urlSearch);
            this.setState({
                showMain: !this.state.showMain
            });
        }
    }
    register = async () => {
        const passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
        if (this.state.password == '') {
                Toast.info('请设置登录密码', 2);
                return;
            } else if (!passwordReg.test(this.state.password)) {
                Toast.info('密码应为6-16位数字与字母组合', 2);
                return;
            }
        const context = {
            password: md5(md5(this.state.password)),
            phone: this.state.phoneNum,
            channel: this.state.utm_source,
            smsCode: this.state.smsCode,
            userAttr:'2'
        }
        const res = await Api.userRegister(context)
        debugger;
        if (res.code != 0) {
            Toast.info(res.message, 2)
        } else {

            const contextSave = {
                mobile: this.state.phoneNum,
                utmsource: this.state.utm_source,
                userid:res.data.userId
            }
            try{
                const saveres = await Api.userRegisterSourceSave(contextSave);
                this.downloadapp();
            }catch (e){
                console.log(e);
            }finally {
              this.downloadapp();
            }

        }
    }


    downloadapp =()=>{
        let __this= this;
        Toast.info('注册成功,正前往下载app...', 2);
        setTimeout(()=>{
            window.location.href = __this.state.downloadLink;
        },1000)
    }


    regSetPwd = () => {
        return (<div className={this.state.showMain ? 'show reg-setPwd' : 'hide reg-setPwd'}>
            <div className="reg-setPwd-center">
                <p className='reg-setPwd-text'>设置登录密码</p>
                <div className="reg-setPwd-pwd">
                    <div className="reg-setPwd-icon">
                    </div>
                    <input type="password" value={this.state.password} onChange={this.change('password')}
                           onFocus={onFocus()} onBlur={onBlur('6-16位数字与字母组合的密码')} className="reg-setPwd-value"
                           placeholder='6-16位数字与字母组合的密码'/>
                </div>
                <div className="reg-submit-btn-finish" onClick={this.register}>
                    确定
                </div>
            </div>
        </div>);
    }

    render() {
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/xinYiDaiRegister/_.css"/>
                </Head>
                <this.regSetPwd/>
                <div className={this.state.showMain ? 'hide reg-main' : 'show remain'} id='reg'>
                    <div className='xy-register-header'  id='reg'>
                        <div className="reg-box">
                            <div className="reg-content">
                                <div className="reg-item phone-num">
                                    <div className="reg-phone-icon">
                                    </div>
                                    <input id='inputNode' type="tel" value={this.phoneNum}  ref={(el) => { this.applyInNode = el; }} onFocus={onFocus()}
                                           onChange={this.change('phoneNum')} onBlur={onBlur('请输入您的手机号码')}
                                           className="reg-phone-num" placeholder='请输入您的手机号码'/>
                                </div>
                                <div className="reg-item phone-security-content">
                                    <div className="phone-security-num">
                                        <div className="reg-security-icon">
                                        </div>
                                        <input type='number' onFocus={onFocus()} onBlur={onBlur('短信验证码')}
                                               className="reg-security-num" placeholder='短信验证码' value={this.state.smsCode}
                                               onChange={this.change('smsCode')}/>
                                    </div>
                                    <div className="reg-security-num-btn" disabled={this.state.textDisabled}
                                         onClick={this.sendMsg('sendMessage')}>{this.state.sendTextCode}

                                    </div>
                                </div>
                                <div className="phone-submit-btn" onClick={this.applyIn} >
                                    我要申请
                                </div>
                                <div className="reg-download-app">
                                    <span className='reg-download-notice'>已注册用户</span>
                                    <a href={this.state.downloadLink} className='reg-download-link'>点击下载APP登录</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="reg-broadcast">
                        <div className='reg-bc-item'>
                            <div className="reg-bc-center">
                                <div className="reg-bc-icon">
                                    <img src="/static/mods/xinYiDaiRegister/imgs/time.png"
                                         className='time-icon reg-icon' alt=""/>
                                </div>
                                <div className="reg-bc-text">
                                    <h3 className="reg-bc-title">
                                        放款快
                                    </h3>
                                    <h4 className="reg-bc-p">
                                        最快10分钟放款
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className='reg-bc-item'>
                            <div className="reg-bc-center">
                                <div className="reg-bc-icon">
                                    <img src="/static/mods/xinYiDaiRegister/imgs/id.png" className='time-icon reg-icon'
                                         alt=""/>
                                </div>
                                <div className="reg-bc-text reg-bc-text-sp">
                                    <h3 className="reg-bc-title">
                                        门槛低
                                    </h3>
                                    <h4 className="reg-bc-p">
                                        无抵押、无担保、
                                        纯线上操作
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className='reg-bc-item'>
                            <div className="reg-bc-center">
                                <div className="reg-bc-icon">
                                    <img src="/static/mods/xinYiDaiRegister/imgs/security.png"
                                         className='time-icon reg-icon' alt=""/>
                                </div>
                                <div className="reg-bc-text">
                                    <h3 className="reg-bc-title">
                                        隐私安全
                                    </h3>
                                    <h4 className="reg-bc-p">
                                        个人信息完全保密
                                    </h4>
                                </div>
                            </div>
                        </div>
                        <div className='reg-bc-item'>
                            <div className="reg-bc-center">
                                <div className="reg-bc-icon">
                                    <img src="/static/mods/xinYiDaiRegister/imgs/cash.png"
                                         className='time-icon reg-icon' alt=""/>
                                </div>
                                <div className="reg-bc-text">
                                    <h3 className="reg-bc-title">
                                        借钱多
                                    </h3>
                                    <h4 className="reg-bc-p">
                                        最高可借20万
                                    </h4>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="reg-flow">

                    </div>
                    <div className="reg-info">
                        <p className='reg-info-p'>4000-169-521（9:00-18:00工作日）</p>
                        <p className='reg-info-p'>总部地址：上海市虹口区四川北路859号中信广场28F</p>
                        <p className='reg-info-p'>新新贷（上海）金融信息服务有限公司</p>
                        <p className='reg-info-p'>沪ICP备案 12026657号-1</p>
                        <p className='reg-info-p'>市场有风险，出借需谨慎</p>
                        <p className='reg-info-p'>是否2小时到账，视个人情况而定</p>
                    </div>
                    <div  className={this.state.showApplyIn ? 'hide reg-bottom-btn' : 'show reg-bottom-btn'}>
                        <div className="reg-apply-btn">
                            <a href="#reg">我要申请</a>
                        </div>
                    </div>
                </div>
                <Modal
                    key={() => Math.random()}
                    visible={this.state.imgModal}
                    transparent
                    maskClosable={false}
                    onClose={this.onClose('imgModal')}
                    title="请输入验证码"
                    footer={[{
                        text: '取消', onPress: () => {
                            console.log('chanel');
                            this.onClose('imgModal')();
                        }
                    }, {text: '确定', onPress: this.sendImgCode}]}
                >
                    <div className="phoneCode">
                        <input type="text" onFocus={onFocus()} onBlur={onBlur('输入验证码')} placeholder="输入验证码"
                               value={this.state.imgCode} onChange={this.imgChange}/><img src={this.state.imgUrl}
                                                                                          onClick={this.reset}/>
                    </div>
                </Modal>
            </div>
        )
    }
}