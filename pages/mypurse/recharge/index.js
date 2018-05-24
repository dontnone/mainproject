import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../../components/header/index'
import { getBankInfo, toUrl, onFocus, onBlur } from '../../../common/Util'
import Api from '../../../components/api/purse'
import { Toast } from 'antd-mobile'

export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rechargeType: 'quick',
            bankCont: {},
            bankInfo: {},
            bankCard: '',
            rechangeNum: ''
        }
    }
    async componentDidMount() {
        const res = await Api.rechargeInit()
        const bankInfo = getBankInfo(res.bankCode)
        let cardCode = '**** **** **** ' + res.cardNo
        this.setState({
            bankCont: res,
            bankInfo: bankInfo,
            bankCard: cardCode
        })
    }
    rechargeChange = key => () => {
        this.setState({
            rechargeType: key 
        })
    }
    entryRechange = (e) =>{
        var reg = /^\d+\.?(\d{1,2})?$/
        if(!reg.test(e.target.value)){
            if(e.target.value != '') return
        }
        this.setState({
            rechangeNum: e.target.value
        })
    }
    confirmRecharge = async () => {
        const rechangeNum = this.state.rechangeNum
        if(rechangeNum == ''){
            Toast.info('请输入充值金额', 2)
            return
        }else if(rechangeNum < 2){
            Toast.info('最小充值金额为2元', 2)
            return
        }else if(Number(rechangeNum) > Number(this.state.bankCont.singleLimit)){
            Toast.info(`单笔充值不可大于${this.state.bankCont.singleLimit}元`, 2)
            return
        }
        const context = {
            rechargeAmount: this.state.rechangeNum
        }
        const res = await Api.recharge(context)

        if(res.code == 0){
            toUrl(res.data.requestUrl, res.data)
        }else{
            Toast.info(res.message, 2)
        }
        console.log(res)
    }
//     <div className="tab-wrapper">
//     <ul className="tab">
//         <li className={ this.state.rechargeType == 'quick' ? 'tab-link tab-link-act' : 'tab-link' } onClick={ this.rechargeChange('quick') }><a href="#">快捷充值</a></li>
//         <li className={ this.state.rechargeType == 'offline' ? 'tab-link tab-link-act' : 'tab-link' } onClick={ this.rechargeChange('offline') }><a href="#">线下充值</a></li>
//     </ul>
// </div>
transMoney = (val) => {
    var changeMoney = 0
    if(val){
        if(val > 9999){
            var ractMoney = (val/1e4)
            ractMoney = ractMoney + ''
            if(ractMoney.indexOf('.') != -1){
                if(ractMoney.split(".")[1].length == 1){
                    ractMoney = ractMoney + 0.00 + '万'
                }else{
                    ractMoney = ractMoney.substr(0, ractMoney.indexOf('.') + 3) + '万'
                }
            }else{
                ractMoney = Number(ractMoney).toFixed(2) + '万'
            }
            changeMoney = ractMoney.split('.');
            changeMoney[0] = changeMoney[0].replace(/(\d)(?=(\d{3})+$)/g,'$1,');
            changeMoney = changeMoney.join('.');
        }else{
            val = val + ''
            if(val.indexOf('.') != -1){
                if(val.split(".")[1].length == 1){
                    //51000
                    changeMoney = val + 0.00 + '元'
                }else{
                    //53550.21
                    changeMoney = val.substr(0, val.indexOf('.') + 3) + '元'
                }
            }else{
                //50000
                changeMoney = Number(val).toFixed(2) + '元'
            }
        }
    }

    return changeMoney
  }
    render() {
        const { bankCont, bankInfo } = this.state
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/recharge/_.css" />
                </Head>
                <div className="recharge-box">
                    <Header title="充值" dmp={ true } dev_id="A10.1-1" eventtype="jump" />
                    <div className="recharge-container">
                        <div className="tab-content-wrapper">
                            <div className={ this.state.rechargeType == 'quick' ? 'quickly-recharge tab-content block' : 'quickly-recharge tab-content' }>
                                <div className="bank-card-border clearfix">
                                    <div className="zIndex-wrapper">
                                        <div className="bank-logo">
                                            <img src={ bankInfo.bankCardImg } alt="" />
                                        </div>
                                        <div className="bank-card">
                                            <p className="bank-name">{bankInfo.bankCardName}<span className="card-status">{ bankCont.cardStatus == '1' ? '(换卡申请中)' : '' }</span></p>
                                            <p className="bank-card-number">{this.state.bankCard}</p>
                                        </div>
                                    </div>
                                    <img src={ bankInfo.bankCardImgBg } alt="" className="bank-bg position-a" />
                                </div>
                            
                                <p className="recharge-tips">该卡单笔限额{ this.transMoney(bankCont.singleLimit) }，单日限额{ this.transMoney(bankCont.dailyLimit) }</p>
                
                                <div className="div-input-border">
                                    <input type="number" className="dmp-click" dev_id="A10.1-4" eventtype="any_value" dmp_action="write" value={ this.state.rechangeNum } onChange={ this.entryRechange } onFocus={ onFocus() } onBlur={ onBlur('请输入充值金额,免手续费') } placeholder="请输入充值金额,免手续费" />
                                </div>
                
                                <div className="div-btn">
                                    <button className="xxd-xl-btn dmp-click" dev_id="A10.1-5" eventtype="jump" onClick={ this.confirmRecharge }>确认充值</button>
                                </div>
                                <p className="reminder-txt"><span className="line"></span>温馨提示<span className="line toright-line"></span></p>
                                <div className="reminder-content">
                                    新新贷使用的是银行资金存管模式，网贷客户交易结算资金账户是完 全属于您个人的独立账户，实现完全的自己隔离，新新贷会根据您的授权划拨给借款人，除此之外无权动用。
                                </div>
                            </div>
                
                
                            <div className={ this.state.rechargeType == 'offline' ? 'offline-recharge tab-content block' : 'offline-recharge tab-content' }>
                                <div className="bank-card-wrapper">
                                    <p className="content-tit"><span className="bold-line"></span>我的银行卡</p>
                                    <div className="bank-card-border clearfix">
                                        <div className="bank-logo"></div>
                                        <div className="bank-card">
                                            <p className="bank-name">{bankInfo.bankCardName}</p>
                                            <p className="bank-card-number">{this.state.bankCard}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="xxd-account-wrapper">
                                    <p className="content-tit"><span className="bold-line"></span>新新贷存管账户</p>
                                    <div className="xxd-account-border">
                                        <p>收款方户名：新新贷（上海）金融信息服务有限公司</p>
                                        <p className="mg-38">收款方账号：800003071918</p>
                                        <p>收款方开户行：上海华瑞银行股份有限公司</p>
                                    </div>
                                </div>
                                <div className="explain-wrapper">
                                    <p className="content-tit"><span className="bold-line"></span>操作说明</p>
                                    <ul className="padding-31">
                                        <li>1. 线下充值针对大额转账需要，适用于充值金额超过50,000元。小于此金额，建议您使用快捷充值或网银充值。</li>
                                        <li>2. 仅支持网银、手机银行、柜面操作，不支持支付宝、微信、ATM、现金转账。</li>
                                        <li>3. 仅支持使用您已绑定银行存管户的银行卡操作，若需从本人其他银行卡转账，请先更换绑定银行卡。</li>
                                        <li>4. 线下充值非实时到账：银行核对转入账户成功之后，钱款将于一个工作日内从新新贷存款账户转入您在华瑞银行开设的个人存管账户中。</li>
                                        <li>5. 充值过程中收取转账费用以银行规定为准，新新贷不收取任何其他费用。</li>
                                        <li>6. 如果充值失败，钱款将在10个工作日内退回您充值的银行卡。</li>
                                        <li>7. 线下充值如遇到问题，请联系客服：4000-169-521（工作日9：00-18：00）。</li>
                                    </ul>
                                </div>
                                <div className="reminder-wrapper">
                                    <p className="content-tit"><span className="bold-line"></span>温馨提示</p>
                                    <ul className="padding-31">
                                        <li>1. 新新贷使用的是银行资金存管模式，网贷客户交易结算资金账户是完全属于您个人的独立账户，实现完全的资金隔离，新新贷会根据您的授权划拨给借款人，除此之外无权动用。</li>
                                        <li>2. 严禁洗钱，信用卡套现，一经发现将予以处罚，包括但不限于：冻结账户，永久停止服务，并可能影响银行征信记录。</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}