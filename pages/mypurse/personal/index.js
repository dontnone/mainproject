import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../../components/header/index'
import Api from '../../../components/api/purse'
import { Modal, Toast } from 'antd-mobile'
import { delCookie, delAllCookie, openApp } from '../../../common/Util'
import Cookie from 'js-cookie'

const alert = Modal.alert
export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            userInfo: {},
            isOpen: '',
            isRisk: '',
            isBind: ''
        }
    }
    async componentDidMount() {
        Toast.loading('加载中……', 0)
        const res = await Api.userInfo()
        const resRisk = await Api.resultRisk()
        let isOpen = '', isRisk = '', isBind = ''
        if(res && resRisk){
            isOpen = res.openAccountStatus == '0' ? '未开户' : '已开户'
            isRisk = res.riskExamStatus == '0' ? '未评测' : resRisk.results.typeName
            isBind = res.vipCode == '' ? '未绑定' : '已绑定'
        }
        this.setState({
            userInfo: res,
            isOpen,
            isRisk,
            isBind
        })
        Toast.hide()
        if(!res){
            Toast.info('请先登录', 2)
            setTimeout(()=> {
                location = '/login'
            }, 2000)
        }
    }
    openAccount = () => {
        const userInfo = this.state.userInfo
        if(userInfo.openAccountStatus != '0'){
            location = '/mypurse/openaccount/bind'
        }else{
            if(userInfo.mobile && userInfo.realNameStatus != '0'){
                location = '/mypurse/openaccount'
            }else if(userInfo.realNameStatus == '0'){
                //  跳转到人工实名认证中页面
                location = '/mypurse/openaccount/identityresult'
            }else{
                alert('提示', '您尚未绑定手机号，为了您的账户安全，请前往APP进行绑定手机号后进行开户操作', [
                    { text: '取消', onPress: () => console.log('cancel') },
                    { text: '前往APP', onPress: () => {
                        openApp()
                    }},
                ])
            }
        }
    }
    risk = ()=> {
        if(this.state.userInfo.riskExamStatus == '0'){
            location = '/mypurse/riskrating'
        }else{
            location = '/mypurse/riskrating/result'
        }
    }
    resetPassword = () => {
        if(this.state.userInfo.mobile){
            location = '/password/userreset'
        }else{
            alert('提示', '您尚未绑定手机号，为了您的账户安全，请前往APP进行绑定手机号后进行开户操作', [
                { text: '取消', onPress: () => console.log('cancel') },
                { text: '前往APP', onPress: () => {
                    openApp()
                }},
            ])
        }
    }
    bindVipCode = () => {
       if(this.state.userInfo.vipCode){
           location = '/mypurse/assistant/change?vipid=' + this.state.userInfo.vipCode
       }else{
           location = '/mypurse/assistant'
       }
    }
    exitOut = async () => {
        await Cookie.remove('userToken')
        location = '/home'
    }
    render() {
        const { userInfo } = this.state
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/personal/_.css" />
                </Head>
                <div className="personal-box position-a">
                    <Header title="个人中心" dmp={ true } dev_id="D1.1-1" eventtype="jump" url='/mypurse' />
                    <div className="personal-container position-a">
                        <ul className="main-list xxd-common-list">
                            <li className="list-item dmp-click" dev_id={ userInfo.openAccountStatus == '0' ? 'D1.1-2.2' : 'D1.1-2.1' } eventtype='jump' onClick={ this.openAccount }>
                                <span className="item-icon bank-icon dmp-click" dev_id={ userInfo.openAccountStatus == '0' ? 'D1.1-2.2' : 'D1.1-2.1' } eventtype='jump'></span>
                                <span className="item-txt dmp-click" dev_id={ userInfo.openAccountStatus == '0' ? 'D1.1-2.2' : 'D1.1-2.1' } eventtype='jump'>银行存管开户</span>
                                <span className="item-right-txt account-status dmp-click" dev_id={ userInfo.openAccountStatus == '0' ? 'D1.1-2.2' : 'D1.1-2.1' } eventtype='jump'>{ this.state.isOpen }</span>
                                <span className="arrow-right-icon dmp-click" dev_id={ userInfo.openAccountStatus == '0' ? 'D1.1-2.2' : 'D1.1-2.1' } eventtype='jump'></span>
                            </li>
                            <li className="list-item dmp-click" dev_id={ userInfo.riskExamStatus == '0' ? 'D1.1-3.1' : 'D1.1-3.2' } eventtype='jump' onClick={ this.risk }>
                                <span className="item-icon graph-icon dmp-click" dev_id={ userInfo.riskExamStatus == '0' ? 'D1.1-3.1' : 'D1.1-3.2' } eventtype='jump'></span>
                                <span className="item-txt dmp-click" dev_id={ userInfo.riskExamStatus == '0' ? 'D1.1-3.1' : 'D1.1-3.2' } eventtype='jump'>风险评测</span>
                                <span className="item-right-txt account-status dmp-click" dev_id={ userInfo.riskExamStatus == '0' ? 'D1.1-3.1' : 'D1.1-3.2' } eventtype='jump'>{ this.state.isRisk }</span>
                                <span className="arrow-right-icon dmp-click" dev_id={ userInfo.riskExamStatus == '0' ? 'D1.1-3.1' : 'D1.1-3.2' } eventtype='jump'></span>
                            </li>
                            <li className="list-item dmp-click" dev_id="D1.1-4.1" eventtype="jump" onClick={ this.resetPassword }>
                                <span className="item-icon key-icon dmp-click" dev_id="D1.1-4.1" eventtype="jump"></span>
                                <span className="item-txt dmp-click" dev_id="D1.1-4.1" eventtype="jump">登录密码</span>
                                <span className="arrow-right-icon dmp-click" dev_id="D1.1-4.1" eventtype="jump"></span>
                            </li>
                            <li className="list-item dmp-click" dev_id={ userInfo.vipCode == '' ? 'D1.1-5.2' : 'D1.1-5.1' } eventtype="jump" onClick={ this.bindVipCode }>
                                <span className="item-icon group-icon dmp-click" dev_id={ userInfo.vipCode == '' ? 'D1.1-5.2' : 'D1.1-5.1' } eventtype="jump"></span>
                                <span className="item-txt dmp-click" dev_id={ userInfo.vipCode == '' ? 'D1.1-5.2' : 'D1.1-5.1' } eventtype="jump">专属财富顾问</span>
                                <span className="item-right-txt account-status dmp-click" dev_id={ userInfo.vipCode == '' ? 'D1.1-5.2' : 'D1.1-5.1' } eventtype="jump">{ this.state.isBind }</span>
                                <span className="arrow-right-icon dmp-click" dev_id={ userInfo.vipCode == '' ? 'D1.1-5.2' : 'D1.1-5.1' } eventtype="jump"></span>
                            </li>
                        </ul>
                        <div className="div-btn">
                            <button className="xxd-xl-btn" onClick={ this.exitOut } >安全退出</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}