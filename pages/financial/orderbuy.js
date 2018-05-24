import React, { PureComponent } from 'react'
import Head from 'next/head'
import Header from '../../components/header/index'
import { Modal, Toast } from 'antd-mobile'
import Api from '../../components/api/financial'
import userApi from '../../components/api/purse'
import homeApi from '../../components/api/home'
import { getCookie, getQueryString, onFocus, onBlur, openApp } from '../../common/Util'
import track from '../../static/merge/track-base'
const alert = Modal.alert
export default class extends PureComponent {
    constructor(props) {
        super(props)
        this.state = {
            buyMoney: '',
            account: {},
            redJson: {},
            redCanUser: 0,
            protocol: true,
            id: '',
            data: {
                productDetail: {}
            }
        }
    }
    async componentDidMount() {
        Toast.loading('加载中……', 0)
        track.init()
        const context = { id: getQueryString('id'), type: '10' }
        const data = await Api.financialDetail(context)
        await this.setState({
            id: getQueryString('id'),
            data
        })
        
        if(sessionStorage.getItem('chargeUrl')){
            sessionStorage.removeItem('chargeUrl')
        }
        if(sessionStorage.getItem('loginType')){
            sessionStorage.removeItem('loginType')
        }
        const account = await Api.userAccount()
        const isOpenAccount = await userApi.userInfo()
        if(isOpenAccount.openAccountStatus != '1'){
            //  已开户
            alert('提示', '请先开通存管账户', [
                { text: '立即开户', onPress: () => {
                    location = '/mypurse/personal'
                }},
            ])
            Toast.hide()
            return
        }

        const homeRes = await homeApi.homeServer()
        if(homeRes.data.investStatus != '0'){
            alert('提示', '新手专享，更多产品尽在APP', [
                { text: '首页', onPress: () => location = '/home' },
                { text: '前往APP', onPress: () => {
                    openApp()
                }},
            ])
            Toast.hide()
            return
        }

        this.setState({
            account,
            redJson: JSON.parse(sessionStorage.getItem('redJson')) || {}
        })
        if(sessionStorage.getItem('number')){
            await this.setState({
                buyMoney: sessionStorage.getItem('number')
            })
            this.redPackageCanUser()
            sessionStorage.removeItem('number')
        }
        sessionStorage.removeItem('redJson')
        
        Toast.hide()
    }
    changeMoney = (val) => {
        var changeMoney = 0
        const ractMoney = String(val).indexOf('.') != -1 ? val : !val ? '0.00' : val + '.00'
        changeMoney = ractMoney.split('.');
        changeMoney[0] = changeMoney[0].replace(/(\d)(?=(\d{3})+$)/g,'$1,');
        changeMoney = changeMoney.join('.');
        return changeMoney
    }
    change = async (e) => {
        let meValue = e.target.value
        let maxAccount = this.state.data.productDetail.mostInvestAmount
        let userLostAccount = this.state.account.availableBalance
        this.setState({
            redJson: {}
        })
        sessionStorage.removeItem('redJson')
        if(meValue.length > 10){
            return
        }
        //  如果用户输入金额大于可投最大金额，赋值返回
        if(parseInt(meValue) > parseInt(maxAccount)){
            Toast.info('该产品可投金额为' + maxAccount + '元', 2)
            await this.setState({
                buyMoney: maxAccount
            })
            this.redPackageCanUser()
            return
        }
        // 如果用户输入金额大于可用余额并且小于最大出借额
        let num = Math.floor(userLostAccount / 100) * 100
        if(parseInt(meValue) > userLostAccount && parseInt(meValue) < maxAccount){
            Toast.info('可用余额不足，请先充值', 2)
            await this.setState({
                buyMoney: num
            })
            this.redPackageCanUser()
            return
        }
        await this.setState({
            buyMoney: meValue
        })
        this.redPackageCanUser()
    }
    blur = async (e) => {
        onBlur('100元的整数倍递增')
        let meValue = e.target.value
        let num = Math.floor(meValue / 100) * 100
        if(meValue % 100 !== 0 || e.target.value == 0){
            await this.setState({
                buyMoney: num
            })
            this.redPackageCanUser()
            Toast.info('输入的金额须为100的整倍数', 2)
        }
    }
    reduce = async () => {
        this.setState({
            redJson: {}
        })
        sessionStorage.removeItem('redJson')
        if(this.state.buyMoney >= 100){
            await this.setState({
                buyMoney: this.state.buyMoney - 100
            })
            this.redPackageCanUser()
        }
    }
    add = async () => {
        this.setState({
            redJson: {}
        })
        sessionStorage.removeItem('redJson')
        let maxAccount = this.state.data.productDetail.mostInvestAmount
        let userLostAccount = this.state.account.availableBalance
        if(this.state.buyMoney == '' && userLostAccount > 100){
            await this.setState({
                buyMoney: 100
            })
            this.redPackageCanUser()
            return
        }
        if(userLostAccount < 100){
            return
        }
        if(parseInt(this.state.buyMoney) + 100 > maxAccount || parseInt(this.state.buyMoney) + 100 > userLostAccount){
            return
        }
        await this.setState({
            buyMoney: parseInt(this.state.buyMoney) + 100
        })
        this.redPackageCanUser()
    }
    allInvest = async () => {
        let maxAccount = this.state.data.productDetail.mostInvestAmount
        let userLostAccount = this.state.account.availableBalance
        let num = Math.floor(userLostAccount / 100) * 100
        this.setState({
            redJson: {}
        })
        sessionStorage.removeItem('redJson')
        if(userLostAccount < maxAccount){
            await this.setState({
                buyMoney: num
            })
            this.redPackageCanUser()
        }else{
            await this.setState({
                buyMoney: maxAccount
            })
            this.redPackageCanUser()
        }
    }
    redPackageCanUser = async () => {
        const { productId, productType } = this.state.data.productDetail
        const packageContext = {
            productId: productId,
            amount: this.state.buyMoney,
            productType: productType,
            page: 1
        }
        const res = await Api.packageCanUser(packageContext)
        const items = res.items
        let sum = 0
        for(let i=0; i<items.length; i++){
            if(items[i].canUse == 1){
                sum++
            }
        }
        this.setState({
            redCanUser: sum
        })
    }
    chooiceRedPackage = () => {
        sessionStorage.setItem('number', this.state.buyMoney)
        location = '/financial/redpackagethirty?money=' + this.state.buyMoney + '&id=' + this.state.id
    }
    checkdProtocol = () => {
        this.setState({
            protocol: !this.state.protocol
        })
    }
    buyProduct = async () => {
        const { leastInvestAmount, productId, productType } = this.state.data.productDetail
        if(this.state.buyMoney < leastInvestAmount){
            Toast.info('该产品起投金额为' + leastInvestAmount + '元', 2)
            await this.setState({
                buyMoney: Number(leastInvestAmount),
                redJson: {}
            })
            this.redPackageCanUser()
            return
        }else{
            Toast.loading('加载中', 0)
            let payContext = {
                productId: productId,
                productType: productType,
                investAmount: this.state.buyMoney
            }
            if(JSON.stringify(this.state.redJson) != "{}"){
                if(this.state.redJson.redType == '1'){
                    payContext.couponId = this.state.redJson.redCode
                }else{
                    payContext.redPackageCode = this.state.redJson.redCode
                }
            }
            const res = await Api.financialBuy(payContext)
            if(res.code != 0){
                Toast.info(res.message, 2)
            }else{
                sessionStorage.setItem('successInfo', JSON.stringify(res.data))
                location = '/financial/buysuccess'
            }
            
            // 
        }
    }
    serviceProtocol = () => {
        const { productDetail } = this.state.data
        location = '/modal/thirtyAgreement?productId=' + productDetail.productId + '&productCode=XSCP30T&productJoinId=' + productDetail.joinId + '&token=' + getCookie('userToken') + '&clientTime=' + (new Date()).getTime()
    }
    recharge = () => {
        sessionStorage.setItem('chargeUrl', location.href)
        location = '/mypurse/recharge'
    }
    render() {
        const productDetail = this.state.data.productDetail
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/financial/_.css" />
                </Head>
                <div className="product—detail-container product—purchase-container position-a">
                    <div className="product-top">
                        <p className="product-name">{ productDetail.name }</p>
                        <p className="product-earnings-txt">历史年化收益</p>
                        <p className="rate"><span>{ productDetail.plannedAnnualRate || 0 }%</span>{ productDetail.floatingRate > 0 ? '+' + productDetail.floatingRate + '%' : '' }</p>
                        <p className="lock-data">服务期：{productDetail.leastPeriod}{productDetail.leastPeriodUnit}</p>
                    </div>
                    <ul className="purchase xxd-common-list">
                        <li className="list-item mt-10">
                            <span className="item-txt">账户余额：</span>
                            <span className="item-txt">{ this.changeMoney(String(this.state.account.availableBalance || 0)) }元</span>
                            <span className="item-right-txt link-color" onClick={ this.recharge }>充值</span>
                        </li>
                        <li className="list-item mt-10 pd-10">
                            <span className="item-txt">加入金额</span>
                            <div className="input-wrapper">
                                <p className="max-count-tips">你最大可加入金额{this.changeMoney(productDetail.mostInvestAmount)}元</p>
                                <button type="button" className="minus" disabled={ this.state.buyMoney > 100 ? false : true } onClick={ this.reduce }>-</button>
                                <input type="number" onFocus={ onFocus() } placeholder="100元的整数倍递增" value={ this.state.buyMoney } onChange={ this.change } onBlur={ this.blur } />
                                <button type="button" className="add" disabled={ Number(this.state.buyMoney) >= Number(productDetail.mostInvestAmount) || Number(this.state.buyMoney) >= Number(this.state.account.availableBalance) || this.state.account.availableBalance < 100 ? true : false  } onClick={ this.add }>+</button>
                            </div>
                            <button type="button" className="all-btn" onClick={ this.allInvest }>全投</button>
                        </li>
                        <li className="list-item mt-10">
                            <span className="item-txt">红包</span>
                            <span className="item-right-txt" onClick={ this.chooiceRedPackage }>{ JSON.stringify(this.state.redJson) != "{}" ? '-' + this.state.redJson.redNum + '元' : this.state.redCanUser == 0 ? '暂无可用红包' : this.state.redCanUser + '个可用' }</span>
                            <span className="arrow-right-icon"></span>
                        </li>
                        <li className="list-item">
                            <span className="item-right-txt pay-count">实际支付：{ JSON.stringify(this.state.redJson) != "{}" ?  this.changeMoney(String(this.state.buyMoney - this.state.redJson.redNum)) : this.changeMoney(String(this.state.buyMoney)) }元</span>
                        </li>
                    </ul>
                    <p className="confirm-tips">
                        <label htmlFor="" onClick={ this.checkdProtocol }>
                            <span className={ this.state.protocol ? 'checkbox checked' : 'checkbox' }></span>
                            <input type="checkbox" defaultChecked />
                        </label>
                        <span>我已阅读并同意 <a onClick={ this.serviceProtocol } className="link-color">《{productDetail.name}服务协议》</a>、<a href="/modal/proxy" className="link-color">《自动配标委托书》</a>、<a href="/modal/electron" className="link-color">《电子签名（章）授权委托书》</a></span>
                    </p>
                </div>
                <div className="div-bottom-btn">
                    <button className="xxd-xl-btn dmp-click" dev_id="A9.2-1" eventtype="jump" onClick={ this.buyProduct } disabled={ !this.state.buyMoney || !this.state.protocol ? true : false }>确定加入</button>
                </div>
            </div>
        )
    }
}