import React, { Component } from 'react'
import Head from 'next/head'
import Header from '../../../components/header/index'
import Api from '../../../components/api/redpacket'
import userInfo from '../../../components/api/purse'
import { Toast, Modal } from 'antd-mobile'
import { onFocus, onBlur, openApp } from '../../../common/Util'

const alert = Modal.alert
export default class extends Component {
    constructor(props) {
        super(props)
        this.state = {
            xxbNum: 0,
            xxbExchange: '0.00',
            proportion: '0',
            exchangeXxb: '',
            afterMoney: '0.00'
        }
    }
    async componentDidMount() {
        const res = await Api.xxbInfo()
        this.setState({
            xxbNum: res.num,
            xxbExchange: res.amount,
            proportion: res.ratio
        })
    }
    entryXxbNum = (e) => {
        const reg = /^\d+$/
        if(!reg.test(e.target.value)){
            if(e.target.value != '') return
        }
        if(e.target.value > Number(this.state.xxbNum) && Number(this.state.xxbNum) != 0 ){
            Toast.info('您当前最多可兑换' + this.state.xxbNum + '个新新币', 2)
            this.setState({
                afterMoney: (this.state.xxbNum / 50).toFixed(2),
                exchangeXxb: this.state.xxbNum
            })
            return
        }
        if(this.state.xxbNum == 0){
            Toast.info('您当前持有新新币数量为' + this.state.xxbNum, 2)
            this.setState({
                afterMoney: (this.state.xxbNum / 50).toFixed(2),
                exchangeXxb: this.state.xxbNum
            })
            return
        }
        this.setState({
            afterMoney: (e.target.value / 50).toFixed(2),
            exchangeXxb: e.target.value
        })
    }
    allExchange = () => {
        if(this.state.xxbNum > 0){
            this.setState({
                afterMoney: (this.state.xxbNum / 50).toFixed(2),
                exchangeXxb: this.state.xxbNum
            })
        }else{
            Toast.info('您当前持有新新币为0', 2)
        }
    }
    nowExchange = async () => {
        Toast.loading('加载中……', 0)
        const res = await userInfo.userInfo()
        if(res.openAccountStatus == '0'){
            if(res.mobile){
                alert('提示', '请先开户', [
                    { text: '取消', onPress: () => console.log('cancel') },
                    { text: '存管开户', onPress: () => {
                        location = '/mypurse/openaccount'
                    }},
                ])
                Toast.hide()
            }else{
                alert('提示', '您尚未绑定手机号，为了您的账户安全，请前往APP进行绑定手机号后进行开户操作', [
                    { text: '取消', onPress: () => console.log('cancel') },
                    { text: '前往APP', onPress: () => {
                        openApp()
                    }},
                ])
                Toast.hide()
            }
        }else{
            if(this.state.xxbNum == 0){
                Toast.info('您当前持有新新币为0', 2)
            }else{
                if(this.state.exchangeXxb == '' || this.state.exchangeXxb == 0){
                    Toast.info('请输入您要兑换的新新币个数', 2)
                }else{
                    const exchange = await Api.xxbExcahnge({coinNum: this.state.exchangeXxb})
                    Toast.info(exchange.message, 2)
                    if(exchange.code == 0){
                        const resXxb = await Api.xxbInfo()
                        await this.setState({
                            xxbNum: resXxb.num,
                            xxbExchange: resXxb.amount,
                            proportion: resXxb.ratio,
                            exchangeXxb: '',
                            afterMoney: '0.00'
                        })
                    }
                }
            }
        }
    }
    render() {
        return (
            <div>
                <Head>
                    <link rel='stylesheet' type='text/css' href="/static/mods/mypurse/xxb/_.css" />
                </Head>
                <div className="xxb-box">
                    <Header title="我的新新币" url="/mypurse" dmp={ true } dev_id="A12.7-1" eventtype="jump" rightTitle="兑换记录" everyRead={ ()=> location = '/mypurse/xxb/record' } />
                    <div className="xxb-container">
                        <div className="xxb-detail">
                            <div className="xxb-count-wrapper">
                                <div className="xxb-count">
                                    <p className="count">{ this.state.xxbNum }个</p>
                                    <p className="txt">新新币总额</p>
                                </div>
                                <div className="xxb-amount">
                                    <p className="count">{ this.state.xxbExchange }元</p>
                                    <p className="txt">可兑换金额</p>
                                </div>
                            </div>
                            <p className="exchange-tips">新新币兑换人民币的比例为{ this.state.proportion }:1，兑换成功后金额增加至账户余额</p>
                        </div>
                        <div className="xxb-exchange">
                            <div className="input-wrapper">
                                <span className="input-left">我的兑换</span>
                                <input type="text" className="dmp-click" dev_id="A12.7-3" eventtype="any_value" dmp_action="write" value={ this.state.exchangeXxb } onChange={ this.entryXxbNum } onFocus={ onFocus() } onBlur={ onBlur('请输入兑换新新币个数') } placeholder="请输入兑换新新币个数" />
                                <button type="button" className="dmp-click" dev_id="A12.7-4" eventtype="refresh" onClick={ this.allExchange }>全部兑换</button>
                                <p className="exchange-count">将兑换{this.state.afterMoney}元</p>
                            </div>
                        </div>
                        <div className="div-btn">
                            <button className="xxd-xl-btn dmp-click" dev_id="A12.7-5" eventtype="jump" onClick={ this.nowExchange }>立即兑换</button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}