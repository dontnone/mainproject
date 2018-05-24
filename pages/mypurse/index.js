import React, { Component } from 'react'
import Footer from '../../components/footer/index'
import Ceiling from '../../components/ceiling/index'
import Head from 'next/head'
import { Toast, Modal } from 'antd-mobile'
import Api from '../../components/api/purse'
import { openApp } from '../../common/Util'
import track from '../../static/merge/track-base'

const alert = Modal.alert
export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            modals: false,
            hideMoney: false,
            messageNote: false,
            userInfo: {}
        }
    }
    async componentDidMount() {
        Toast.loading('加载中……', 0)
        track.init()
        if(sessionStorage.getItem('chargeUrl')){
            sessionStorage.removeItem('chargeUrl')
        }
        const res = await Api.userInfo()
        localStorage.clear()
        await this.setState({
            userInfo: res
        })
        if(!res){
            Toast.info('请先登录', 2)
            setTimeout(()=> {
                location = '/login'
            }, 2000)
        }
        const resMessage = await Api.messageInfo()
        if(resMessage.unreadAllNum > 0){
            this.setState({
                messageNote: true
            })
        }
        Toast.hide()
    }
    changeMoney = (val) => {
        if(val){
            var changeMoney = 0
            const ractMoney = Number(val).toFixed(2)
            changeMoney = ractMoney.split('.');
            changeMoney[0] = changeMoney[0].replace(/(\d)(?=(\d{3})+$)/g,'$1,');
            changeMoney = changeMoney.join('.');
            return changeMoney
        }
    }
    openAccount = () => {
        if(this.state.userInfo.mobile && this.state.userInfo.realNameStatus != '0'){
            location = '/mypurse/openaccount'
        }else if(this.state.userInfo.realNameStatus == '0'){
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
    hideMoney = ()=> {
        this.setState({
            hideMoney: !this.state.hideMoney
        })
    }
    showModal = () => {
        if(this.state.userInfo.openAccountStatus == '0'){
            alert('提示', '请先开通存管账户', [
                { text: '取消', onPress: () => console.log('cancel') },
                { text: '立即开户', onPress: () => {
                    location = '/mypurse/openaccount'
                }},
            ])
        }else{
            this.setState({
                modals: true
            })
        }
    }
    onClose = key => () => {
        this.setState({
            [key]: false,
        });
    }
    recharge = () => {
        if(this.state.userInfo.openAccountStatus == '0'){
            alert('提示', '请先开通存管账户', [
                { text: '取消', onPress: () => console.log('cancel') },
                { text: '立即开户', onPress: () => {
                    location = '/mypurse/openaccount'
                }},
            ])
        }else{
            sessionStorage.setItem('chargeUrl', location.href)
            location = '/mypurse/recharge'
        }
    }
    render() {
        const { userInfo } = this.state
        if(!userInfo){
            return (
                <div>
                    <Head>
                        <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/_.css" />
                    </Head>
                </div>
            )
        }
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/_.css" />
                </Head>
                <div className="myxqd-box">
                    <Ceiling />
                    <div className="myxqd-container">
                        <div className="main-top assets-content">
                            <div className="assets-content-top">
                                <span className="account"><img className="small-logo head-img" src={ userInfo.iconUrl } />你好，{ userInfo.userName == '' ? (userInfo.mobile == '' ? userInfo.email : userInfo.mobile) : userInfo.userName }</span>
                                <span className="message msg_icon dmp-click" dev_id="A12.1-1" eventtype="jump" onClick={ () => location = '/mypurse/news' }><i className={ this.state.messageNote ? 'red-tips' : '' }></i></span>
                            </div>
                            <div className="total-assets-wrapper">
                                <p className="total-assets-txt"><span>总资产(元)</span><i className={ this.state.hideMoney ? 'visible-icon hide dmp-click' : 'visible-icon dmp-click' } dev_id="A12.1-2" eventtype={ this.state.hideMoney ? 'on' : 'off' } onClick={ this.hideMoney }></i></p>
                                <p className="total-assets">{ this.state.hideMoney ? '****' : this.changeMoney(userInfo.totalAssets) ? this.changeMoney(userInfo.totalAssets) : '0.00' }</p>
                            </div>
                            <div className="total-assets-detail display-table">
                                <div className="table-item item">
                                    <p className="txt">可用余额（元）</p>
                                    <p className="number">{ this.state.hideMoney ? '****' : this.changeMoney(userInfo.availableBalance) ? this.changeMoney(userInfo.availableBalance) : '0.00' }</p>
                                </div>
                                <div className="table-item item pl">
                                    <p className="txt">待收收益（元）</p>
                                    <p className="number">{ this.state.hideMoney ? '****' : this.changeMoney(userInfo.dueInIncome) ? this.changeMoney(userInfo.dueInIncome) : '0.00' }</p>
                                </div>
                            </div>
                
                            <div className="assets-operation-btn">
                                <a className="recharge-btn dmp-click" dev_id="A12.4-1" eventtype="jump" onClick={ this.recharge }>充值</a>
                                <a className="cash-btn dmp-click" dev_id="A12.1-3.2" eventtype={ this.state.userInfo.openAccountStatus == '0' ? 'open_float_window' : 'jump' } onClick={ this.showModal }>提现</a>
                            </div>
                        </div>
                
                        <div onClick={ this.openAccount } className={ userInfo.openAccountStatus == '0' ? 'notice-tips dmp-click' : 'notice-tips hide' } dev_id="A12.2-1" eventtype="open_float_window">请先开通存管账户。</div>
                
                        <div className="red-xxb-wrapper display-table mb-20 bg-fff">
                            <div className="item border-r table-item dmp-click" dev_id="A12.1-3" eventtype="jump" onClick={ ()=> location = '/mypurse/redpacket' }>
                                <p className="txt red dmp-click" dev_id="A12.1-3" eventtype="jump">我的奖励</p>
                                <p className="number dmp-click" dev_id="A12.1-3" eventtype="jump">{ userInfo.couponCanUseNum || 0  } 个</p>
                            </div>
                            <div className="item dmp-click" dev_id="A12.1-4" eventtype="jump" onClick={ () => location = '/mypurse/xxb' }>
                                <p className="txt dmp-click" dev_id="A12.1-4" eventtype="jump">新新币<span className="query-icon-btn dmp-click"  dev_id="A12.1-5" eventtype="open_float_window" onClick={ (e) => {
                                    e.stopPropagation()
                                    alert('提示', '新新币兑换人民币的比例为50:1，成功兑换后可用余额增加，新新币数量减少。', [
                                    { text: '确定', onPress: () => {
                                        console.log('close')
                                    }},
                                ]) }}></span></p>
                                <p className="number dmp-click" dev_id="A12.1-4" eventtype="jump">{ userInfo.xxbNum || 0 } 个</p>
                            </div>
                        </div>
                
                        <ul className="main-list xxd-common-list">
                            <li className="list-item dmp-click" dev_id="A12.1-6" eventtype="jump" onClick={ () => location = '/mypurse/investmenthistory' }>
                                <span className="item-icon record-icon dmp-click" dev_id="A12.1-6" eventtype="jump"></span>
                                <span className="item-txt dmp-click" dev_id="A12.1-6" eventtype="jump">加入记录</span>
                                <span className="arrow-right-icon dmp-click" dev_id="A12.1-6" eventtype="jump"></span>
                            </li>
                            <li className="list-item dmp-click" dev_id="A12.1-7" eventtype="jump" onClick={ () => location = '/mypurse/personal' }>
                                <span className="item-icon user-icon dmp-click" dev_id="A12.1-7" eventtype="jump"></span>
                                <span className="item-txt dmp-click" dev_id="A12.1-7" eventtype="jump">个人中心</span>
                                <span className="arrow-right-icon dmp-click" dev_id="A12.1-7" eventtype="jump"></span>
                            </li>
                            <li className="list-item dmp-click" dev_id="A12.1-8" eventtype="jump" onClick={ ()=> location = '/mypurse/feedback' }>
                                <span className="item-icon feedback-icon dmp-click" dev_id="A12.1-8" eventtype="jump"></span>
                                <span className="item-txt dmp-click" dev_id="A12.1-8" eventtype="jump">意见反馈</span>
                                <span className="arrow-right-icon dmp-click" dev_id="A12.1-8" eventtype="jump"></span>
                            </li>
                            <li className="list-item dmp-click" dev_id="A12.1-9" eventtype="jump" onClick={ ()=> location = '/mypurse/helpcenter' }>
                                <span className="item-icon help-icon dmp-click" dev_id="A12.1-9" eventtype="jump"></span>
                                <span className="item-txt dmp-click" dev_id="A12.1-9" eventtype="jump">帮助中心</span>
                                <span className="arrow-right-icon dmp-click" dev_id="A12.1-9" eventtype="jump"></span>
                            </li>
                        </ul>
                    </div>
                    <Footer type="mypurse"/>
                </div>
                <Modal
                    visible={this.state.modals}
                    transparent
                    onClose={this.onClose('modals')}
                    title="提示"
                    footer={[{ text: '立即前往新新贷金融app', onPress: () => { 
                        openApp()
                    } }]}
                >
                    <div style={{ overflow: 'scroll' }}>
                    为了保障您的资金安全，请您前往新新贷金融app进行提现
                    </div>
                </Modal>
            </div>
        )
    }
}