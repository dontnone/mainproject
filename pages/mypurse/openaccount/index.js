import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../../components/header/index'
import { Modal, Toast } from 'antd-mobile'
import Api from '../../../components/api/purse'
import { toUrl, getQueryString, onFocus, onBlur } from '../../../common/Util'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfo: {},
            userName: '',
            idCard: '',
            protocol: true,
            cardDisable: false
        }
    }
    async componentDidMount() {
        const userRes = await Api.userInfo()
        if(userRes.isRealName == 1){
            const res = await Api.userAccounts()
            this.setState({
                userInfo: userRes,
                userName: res.userName,
                idCard: res.userIdCard,
                cardDisable: true
            })
        }
        // if(userRes.realNameStatus == '5'){
        //     Toast.info('第三方无法认证', 2)
        //     return
        // }else if(userRes.realNameStatus == '2'){
        //     Toast.info('认证失败', 2)
        //     return
        // }
    }
    change = key => (e) => {
        const reg = /^[a-zA-Z0-9]+$/g
        if(key == 'userName' && e.target.value.length > 20){
            return
        }
        if(key == 'idCard' && !reg.test(e.target.value)){
            if(e.target.value != '') return
        }
        this.setState({
            [key]: e.target.value
        })
    }
    checkdProtocol = () => {
        this.setState({
            protocol: !this.state.protocol
        })
    }
    agreenOpen = async () => {
        const regIdNo = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;  
        if(!regIdNo.test(this.state.idCard)){
            Toast.info('请输入正确的身份证号', 2)
            return
        }
        const context = {
            realName: this.state.userName,
            idCardNumber: this.state.idCard
        }

        const res = await Api.realUserToken(context)
        if(res.code == '0' || this.state.userInfo.isRealName == '1'){
            const resFuyou = await Api.fuyouJump()
            if(resFuyou.code == '0'){
                toUrl(resFuyou.data.fuiou_open_capital_account_page_url, resFuyou.data.fuiouParams)
            }else{
                Toast.info(resFuyou.message, 2)
                return
            }
        }else if(res.code == '-10' || res.code == '-11'){
            location = '/mypurse/openaccount/identity?username='+this.state.userName + '&userId=' + this.state.idCard 
        }else{
            Toast.info(res.message, 2)
            return
        }
    }
    render() {
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/openaccount/_.css" />
                </Head>
                <div className="open-account-box">
                    <Header title="银行存管开户" dmp={ true } dev_id="D2.1-2" eventtype="jump" />
                    <div className="open-account-container">
                        <div className="open-account-main">
                            <div className="div-input-wrapper">
                                <div className="input-left"><i className="star">*</i><span>姓名</span></div>
                                <div className="input-border"><input type="text" className="dmp-click" dev_id="D2.1-3" dmp_action="write" eventtype="any_value" onFocus={ onFocus() } onBlur={ onBlur('请输入您身份证上的真实姓名') } placeholder="请输入您身份证上的真实姓名" value={ this.state.userName } onChange={ this.change('userName') } disabled={ this.state.cardDisable } /></div>
                            </div>
                            <div className="div-input-wrapper">
                                <div className="input-left"><i className="star">*</i><span>身份证号</span></div>
                                <div className="input-border"><input type="text" className="dmp-click" dev_id="D2.1-4" dmp_action="write" eventtype="any_value" onFocus={ onFocus() } onBlur={ onBlur('请输入您的身份证号') } placeholder="请输入您的身份证号" value={ this.state.idCard } onChange={ this.change('idCard') }  disabled={ this.state.cardDisable }/></div>
                            </div>
                            <div className="checkbox-wrapper">
                                <label htmlFor="" className="dmp-click" dev_id="D2.1-5" eventtype={ this.state.protocol  ? 'off' : 'on' } onClick={ this.checkdProtocol }>
                                    <span className={ this.state.protocol ? 'checkbox checked dmp-click' : 'checkbox dmp-click' } dev_id="D2.1-5" eventtype={ this.state.protocol  ? 'off' : 'on' }></span>
                                    <input type="checkbox" className="dmp-click" dev_id="D2.1-5" eventtype={ this.state.protocol  ? 'off' : 'on' } defaultChecked />
                                </label>
                                <p>我已阅读并同意<a href="/modal/licensingAgreement" className="dmp-click" dev_id="D2.1-6" eventtype="jump">《用户授权协议》</a></p>
                            </div>
                            <div className="div-btn"><button className="xxd-xl-btn dmp-click" dev_id="D2.1-7" eventtype="jump" disabled={ this.state.userName && this.state.idCard && this.state.protocol ? false : true } onClick={ this.agreenOpen }>同意协议并开通存管账户</button></div>
                        </div>
                        <div className="open-account-prompt">
                            <div className="prompt">
                                <div className="prompt-tit">为什么开通银行存管账户？</div>
                                <div className="prompt-content">为了保障出借人的资金安全，新新贷全面采用银行存管的运营模式，只有成功开通了银行存管账户，才能在新新贷平台 进行充值、出借等行为</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}